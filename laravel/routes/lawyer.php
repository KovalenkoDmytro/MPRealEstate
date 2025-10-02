<?php

use App\Http\Controllers\DealController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LawyerController;

// Lawyer Dashboard
Route::prefix('lawyer')->middleware(['auth', 'role:lawyer'])->name('lawyer.')->group(function () {
    Route::get('/', [LawyerController::class, 'dashboard'])->name('dashboard');
    Route::get('deals', [DealController::class, 'index'])->name('deals.index');
});
