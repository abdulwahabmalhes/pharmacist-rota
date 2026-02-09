<?php

namespace App\Http\Controllers;

use App\Models\DailyAvailability;
use App\Models\DailyPlan;
use App\Models\DailyPlanItem;
use App\Models\Pharmacist;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlanController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->date;

        // Check if plan already exists for this date
        $existingPlan = DailyPlan::forDate($date)->first();
        if ($existingPlan) {
            // Delete existing plan and its items
            $existingPlan->delete();
        }

        // Get available pharmacists for this date
        $availablePharmacistIds = DailyAvailability::forDate($date)
            ->available()
            ->pluck('pharmacist_id')
            ->toArray();

        // If no availability records exist for the date, assume all active pharmacists are available
        if (empty($availablePharmacistIds)) {
            $availablePharmacistIds = Pharmacist::active()->pluck('id')->toArray();
        } else {
            // Filter to only active pharmacists
            $availablePharmacistIds = Pharmacist::active()
                ->whereIn('id', $availablePharmacistIds)
                ->pluck('id')
                ->toArray();
        }

        if (empty($availablePharmacistIds)) {
            return response()->json([
                'message' => 'No available pharmacists for this date',
            ], 400);
        }

        // Get active pharmacies
        $pharmacies = Pharmacy::active()->get();

        if ($pharmacies->isEmpty()) {
            return response()->json([
                'message' => 'No active pharmacies available',
            ], 400);
        }

        // Create the plan
        $plan = DailyPlan::create([
            'date' => $date,
            'generated_by' => $request->user()->id,
            'algorithm' => 'random-v1',
        ]);

        // Shuffle pharmacies for randomness
        $shuffledPharmacies = $pharmacies->shuffle();

        // Round-robin assignment
        $pharmacistCount = count($availablePharmacistIds);
        $slotCounters = array_fill_keys($availablePharmacistIds, 0);

        foreach ($shuffledPharmacies as $index => $pharmacy) {
            $pharmacistId = $availablePharmacistIds[$index % $pharmacistCount];
            $slotCounters[$pharmacistId]++;

            DailyPlanItem::create([
                'daily_plan_id' => $plan->id,
                'pharmacist_id' => $pharmacistId,
                'pharmacy_id' => $pharmacy->id,
                'slot_index' => $slotCounters[$pharmacistId],
                'status' => 'Planned',
            ]);
        }

        // Load the plan with relationships
        $plan->load(['items.pharmacist', 'items.pharmacy', 'generator']);

        // Group items by pharmacist
        $grouped = $plan->items->groupBy('pharmacist_id')->map(function ($items) {
            $pharmacist = $items->first()->pharmacist;
            return [
                'pharmacist' => [
                    'id' => $pharmacist->id,
                    'full_name' => $pharmacist->full_name,
                    'home_area' => $pharmacist->home_area,
                ],
                'pharmacies' => $items->map(function ($item) {
                    return [
                        'item_id' => $item->id,
                        'slot_index' => $item->slot_index,
                        'pharmacy' => [
                            'id' => $item->pharmacy->id,
                            'name' => $item->pharmacy->name,
                            'area' => $item->pharmacy->area,
                            'address' => $item->pharmacy->address,
                        ],
                        'status' => $item->status,
                    ];
                })->values(),
            ];
        })->values();

        return response()->json([
            'plan' => [
                'id' => $plan->id,
                'date' => $plan->date->format('Y-m-d'),
                'algorithm' => $plan->algorithm,
                'generated_by' => $plan->generator->name,
                'created_at' => $plan->created_at,
            ],
            'assignments' => $grouped,
        ], 201);
    }

    public function index(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->date;
        $user = $request->user();

        $plan = DailyPlan::forDate($date)
            ->with(['items.pharmacist', 'items.pharmacy', 'generator'])
            ->first();

        if (!$plan) {
            return response()->json([
                'message' => 'No plan found for this date',
                'plan' => null,
                'assignments' => [],
            ]);
        }

        $items = $plan->items;

        // If pharmacist, filter to only their items
        if ($user->isPharmacist()) {
            // Find pharmacist record linked to this user (by email match or direct link)
            $pharmacist = Pharmacist::where('full_name', 'like', '%' . explode('@', $user->email)[0] . '%')->first();
            if ($pharmacist) {
                $items = $items->where('pharmacist_id', $pharmacist->id);
            } else {
                $items = collect([]);
            }
        }

        // Group items by pharmacist
        $grouped = $items->groupBy('pharmacist_id')->map(function ($items) {
            $pharmacist = $items->first()->pharmacist;
            return [
                'pharmacist' => [
                    'id' => $pharmacist->id,
                    'full_name' => $pharmacist->full_name,
                    'home_area' => $pharmacist->home_area,
                ],
                'pharmacies' => $items->map(function ($item) {
                    return [
                        'item_id' => $item->id,
                        'slot_index' => $item->slot_index,
                        'pharmacy' => [
                            'id' => $item->pharmacy->id,
                            'name' => $item->pharmacy->name,
                            'area' => $item->pharmacy->area,
                            'address' => $item->pharmacy->address,
                        ],
                        'status' => $item->status,
                    ];
                })->values(),
            ];
        })->values();

        return response()->json([
            'plan' => [
                'id' => $plan->id,
                'date' => $plan->date->format('Y-m-d'),
                'algorithm' => $plan->algorithm,
                'generated_by' => $plan->generator->name,
                'created_at' => $plan->created_at,
            ],
            'assignments' => $grouped,
        ]);
    }

    public function today(Request $request)
    {
        $request->merge(['date' => now()->format('Y-m-d')]);
        return $this->index($request);
    }

    public function myToday(Request $request)
    {
        $user = $request->user();
        $date = now()->format('Y-m-d');

        $plan = DailyPlan::forDate($date)
            ->with(['items.pharmacist', 'items.pharmacy'])
            ->first();

        if (!$plan) {
            return response()->json([
                'message' => 'No plan for today',
                'pharmacies' => [],
            ]);
        }

        // Try to find pharmacist by user name or email
        $pharmacist = Pharmacist::where('full_name', $user->name)
            ->orWhere('full_name', 'like', '%' . explode('@', $user->email)[0] . '%')
            ->first();

        if (!$pharmacist) {
            return response()->json([
                'message' => 'No pharmacist profile found for your account',
                'pharmacies' => [],
            ]);
        }

        $items = $plan->items->where('pharmacist_id', $pharmacist->id);

        return response()->json([
            'date' => $date,
            'pharmacist' => [
                'id' => $pharmacist->id,
                'full_name' => $pharmacist->full_name,
            ],
            'pharmacies' => $items->map(function ($item) {
                return [
                    'item_id' => $item->id,
                    'slot_index' => $item->slot_index,
                    'pharmacy' => [
                        'id' => $item->pharmacy->id,
                        'name' => $item->pharmacy->name,
                        'area' => $item->pharmacy->area,
                        'address' => $item->pharmacy->address,
                        'open_from' => $item->pharmacy->open_from,
                        'open_to' => $item->pharmacy->open_to,
                    ],
                    'status' => $item->status,
                ];
            })->values(),
        ]);
    }

    public function updateItemStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Planned,Done,Skipped',
        ]);

        $item = DailyPlanItem::findOrFail($id);
        $user = $request->user();

        // Check permission: HR can update any, Pharmacist only their own
        if ($user->isPharmacist()) {
            $pharmacist = Pharmacist::where('full_name', $user->name)
                ->orWhere('full_name', 'like', '%' . explode('@', $user->email)[0] . '%')
                ->first();

            if (!$pharmacist || $item->pharmacist_id !== $pharmacist->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $item->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status updated successfully',
            'item' => $item,
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'format' => 'sometimes|in:json,csv',
        ]);

        $date = $request->date;
        $format = $request->format ?? 'json';

        $plan = DailyPlan::forDate($date)
            ->with(['items.pharmacist', 'items.pharmacy', 'generator'])
            ->first();

        if (!$plan) {
            return response()->json(['message' => 'No plan found'], 404);
        }

        if ($format === 'csv') {
            $csv = "Pharmacist,Pharmacy,Area,Address,Slot,Status\n";
            foreach ($plan->items as $item) {
                $csv .= sprintf(
                    '"%s","%s","%s","%s",%d,"%s"' . "\n",
                    $item->pharmacist->full_name,
                    $item->pharmacy->name,
                    $item->pharmacy->area,
                    $item->pharmacy->address ?? '',
                    $item->slot_index,
                    $item->status
                );
            }

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="plan-' . $date . '.csv"',
            ]);
        }

        return response()->json([
            'plan' => $plan,
            'items' => $plan->items,
        ]);
    }
}
