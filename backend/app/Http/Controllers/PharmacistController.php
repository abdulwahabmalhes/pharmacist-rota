<?php

namespace App\Http\Controllers;

use App\Models\Pharmacist;
use Illuminate\Http\Request;

class PharmacistController extends Controller
{
    public function index()
    {
        $pharmacists = Pharmacist::orderBy('full_name')->get();
        return response()->json($pharmacists);
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'home_area' => 'required|string|max:255',
            'active' => 'boolean',
        ]);

        $pharmacist = Pharmacist::create($request->all());

        return response()->json($pharmacist, 201);
    }

    public function show(Pharmacist $pharmacist)
    {
        return response()->json($pharmacist);
    }

    public function update(Request $request, Pharmacist $pharmacist)
    {
        $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'home_area' => 'sometimes|required|string|max:255',
            'active' => 'boolean',
        ]);

        $pharmacist->update($request->all());

        return response()->json($pharmacist);
    }

    public function destroy(Pharmacist $pharmacist)
    {
        $pharmacist->delete();

        return response()->json(['message' => 'Pharmacist deleted successfully']);
    }
}
