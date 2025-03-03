<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;

// Open API Routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

// Protected API Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::middleware('role:admin')->get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::middleware('role:seller')->get('/seller/dashboard', [SellerController::class, 'dashboard']);
    Route::middleware('role:buyer')->get('/buyer/dashboard', [BuyerController::class, 'dashboard']);
    Route::middleware('role:lawyer')->get('/lawyer/dashboard', [LawyerController::class, 'dashboard']);
});
