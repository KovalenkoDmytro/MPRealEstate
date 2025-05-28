<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{SellerController, OfferController, RealEstateListingController, DealController};

Route::middleware(['auth', 'role:seller'])->prefix('seller')->name('seller.')->group(function () {
    Route::patch('/offers/{offer}/update-status', [OfferController::class, 'updateStatus'])->name('offers.updateStatus');
    Route::get('/deals', [SellerController::class, 'showAllDeals'])->name('deals.all');

    Route::get('/listing/create', [RealEstateListingController::class, 'create'])->name('listing.create');
    Route::post('/listings', [RealEstateListingController::class, 'store'])->name('listings.store');
    Route::get('/listings/{listing}/edit', [RealEstateListingController::class, 'edit'])->name('listings.edit');
    Route::patch('/listings/{listing}', [RealEstateListingController::class, 'update'])->name('listings.update');

    Route::patch('/deals/{deal}/set-deposit', [DealController::class, 'setDeposit'])->name('deals.setDeposit');
    Route::post('/deals/{deal}/confirm-deposit', [DealController::class, 'confirmDeposit'])->name('deals.confirmDeposit');
    Route::patch('/deals/{deal}/confirm-condition-day', [DealController::class, 'confirmConditionDay'])->name('deals.confirmConditionDay');
    Route::patch('/deals/{deal}/confirm-possession-day', [DealController::class, 'confirmPossessionDay'])->name('deals.confirmPossessionDay');
});
