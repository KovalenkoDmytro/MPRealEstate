<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{SellerController, OfferController, RealEstateListingController, DealController};

Route::middleware(['auth', 'role:seller'])->prefix('seller')->name('seller.')->group(function () {
    Route::patch('/offers/{offer}/update-status', [OfferController::class, 'updateStatus'])->name('offers.updateStatus');

    Route::prefix('listings')->name('listings.')->group(function () {
        Route::get('/', [SellerController::class, 'showAllListings'])->name('index');
        Route::get('/create', [RealEstateListingController::class, 'create'])->name('create');
        Route::post('/', [RealEstateListingController::class, 'store'])->name('store');
        Route::get('/{listing}/edit', [RealEstateListingController::class, 'edit'])->name('edit');
        Route::put('/{listing}', [RealEstateListingController::class, 'update'])->name('update');
        Route::get('/{listing}', [SellerController::class, 'showListing'])->name('show');
        Route::patch('/{listing}/deactivate', [RealEstateListingController::class, 'softDelete'])->name('deactivate');
    });

    Route::prefix('deals')->name('deals.')->group(function () {
        Route::get('/deals', [SellerController::class, 'showAllDeals'])->name('index');
        Route::patch('/deals/{deal}/set-deposit', [DealController::class, 'setDeposit'])->name('setDeposit');
        Route::post('/deals/{deal}/confirm-deposit', [DealController::class, 'confirmDeposit'])->name('confirmDeposit');
        Route::patch('/deals/{deal}/confirm-condition-day', [DealController::class, 'confirmConditionDay'])->name('confirmConditionDay');
        Route::patch('/deals/{deal}/confirm-possession-day', [DealController::class, 'confirmPossessionDay'])->name('confirmPossessionDay');
    });
});
