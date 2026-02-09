<?php

namespace App\Http\Controllers;

use App\Models\DailyAvailability;
use App\Models\Pharmacist;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->date;

        // Get all pharmacists with their availability for the date
        $pharmacists = Pharmacist::with([
            'availabilities' => function ($query) use ($date) {
                $query->whereDate('date', $date);
            }
        ])->orderBy('full_name')->get();

        // Transform to include status
        $result = $pharmacists->map(function ($pharmacist) {
            $availability = $pharmacist->availabilities->first();
            return [
                'id' => $pharmacist->id,
                'full_name' => $pharmacist->full_name,
                'home_area' => $pharmacist->home_area,
                'active' => $pharmacist->active,
                'status' => $availability ? $availability->status : 'Available',
                'note' => $availability ? $availability->note : null,
                'availability_id' => $availability ? $availability->id : null,
            ];
        });

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'availabilities' => 'required|array',
            'availabilities.*.pharmacist_id' => 'required|exists:pharmacists,id',
            'availabilities.*.status' => 'required|in:Available,Off,Sick,Leave',
            'availabilities.*.note' => 'nullable|string|max:500',
        ]);

        $date = $request->date;

        foreach ($request->availabilities as $item) {
            DailyAvailability::updateOrCreate(
                [
                    'date' => $date,
                    'pharmacist_id' => $item['pharmacist_id'],
                ],
                [
                    'status' => $item['status'],
                    'note' => $item['note'] ?? null,
                ]
            );
        }

        return response()->json(['message' => 'Availability saved successfully']);
    }
}
