<?php

use App\Http\Controllers\AppointmentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\RealEstateListingController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\DealController;

// Seller Dashboard & Listings
Route::prefix('seller')->middleware(['auth', 'role:seller'])->name('seller.')->group(function () {
    Route::get('deals', [SellerController::class, 'showAllDeals'])->name('deals.index');

    Route::prefix('listings')->name('listings.')->group(function () {
        Route::post('/', [RealEstateListingController::class, 'store'])->name('store');
        Route::get('create', [RealEstateListingController::class, 'create'])->name('create');
        Route::put('{listing}', [RealEstateListingController::class, 'update'])->name('update');
        Route::get('{listing}', [SellerController::class, 'showListing'])->name('show');
        Route::delete('{listing}/deactivate', [RealEstateListingController::class, 'softDelete'])->name('deactivate');
        Route::get('{listing}/edit', [RealEstateListingController::class, 'edit'])->name('edit');
    });

    Route::prefix('offers')->name('offers.')->group(function () {
        Route::patch('{offer}/update-status', [OfferController::class, 'updateStatus'])->name('updateStatus');
    });

    Route::prefix('deals')->name('deals.')->group(function () {
        Route::patch('{deal}/confirm-condition-day', [DealController::class, 'confirmConditionDay'])->name('confirmConditionDay');
        Route::patch('{deal}/confirm-deposit', [DealController::class, 'confirmDeposit'])->name('confirmDeposit');
        Route::patch('{deal}/confirm-possession-day', [DealController::class, 'confirmPossessionDay'])->name('confirmPossessionDay');
        Route::patch('{deal}/set-deposit', [DealController::class, 'setDeposit'])->name('setDeposit');
    });

    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::get('/', [AppointmentController::class, 'showAllSellerAppointments'])->name('index');
        Route::post('/', [AppointmentController::class, 'handle'])->name('handle');
    });
});
