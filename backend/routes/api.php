<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PharmacistController;
use App\Http\Controllers\PharmacyController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\PlanController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // HR only routes
    Route::middleware('role:HR')->group(function () {
        Route::apiResource('pharmacists', PharmacistController::class);
        Route::apiResource('pharmacies', PharmacyController::class);
        Route::get('/availability', [AvailabilityController::class, 'index']);
        Route::post('/availability', [AvailabilityController::class, 'store']);
        Route::post('/plans/generate', [PlanController::class, 'generate']);
    });

    // HR and Manager routes
    Route::middleware('role:HR,Manager')->group(function () {
        Route::get('/plans', [PlanController::class, 'index']);
        Route::get('/plans/export', [PlanController::class, 'export']);
    });

    // All authenticated users
    Route::get('/plans/today', [PlanController::class, 'today']);
    Route::get('/plans/my-today', [PlanController::class, 'myToday']);
    Route::patch('/plan-items/{id}', [PlanController::class, 'updateItemStatus']);
});
