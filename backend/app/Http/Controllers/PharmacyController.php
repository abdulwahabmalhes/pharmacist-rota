<?php

namespace App\Http\Controllers;

use App\Models\Pharmacy;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    public function index()
    {
        $pharmacies = Pharmacy::orderBy('name')->get();
        return response()->json($pharmacies);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'open_from' => 'nullable|date_format:H:i',
            'open_to' => 'nullable|date_format:H:i',
            'active' => 'boolean',
        ]);

        $pharmacy = Pharmacy::create($request->all());

        return response()->json($pharmacy, 201);
    }

    public function show(Pharmacy $pharmacy)
    {
        return response()->json($pharmacy);
    }

    public function update(Request $request, Pharmacy $pharmacy)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'area' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:500',
            'open_from' => 'nullable|date_format:H:i',
            'open_to' => 'nullable|date_format:H:i',
            'active' => 'boolean',
        ]);

        $pharmacy->update($request->all());

        return response()->json($pharmacy);
    }

    public function destroy(Pharmacy $pharmacy)
    {
        $pharmacy->delete();

        return response()->json(['message' => 'Pharmacy deleted successfully']);
    }
}
