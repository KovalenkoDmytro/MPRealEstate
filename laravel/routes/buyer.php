<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\FavoriteListingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuyerController;
use App\Http\Controllers\OfferController;

// Buyer Dashboard & Listings
Route::prefix('buyer')->middleware(['auth', 'role:buyer'])->name('buyer.')->group(function () {
    Route::get('deals', [BuyerController::class, 'showAllDeals'])->name('deals.index');

    Route::prefix('listings')->name('listings.')->group(function () {
        Route::get('/favorites', [FavoriteListingController::class, 'index'])->name('favorites.index');
        Route::post('/favorites', [FavoriteListingController::class, 'store'])->name('favorites.store');
        Route::delete('/favorites/{listing}', [FavoriteListingController::class, 'destroy'])->name('favorites.destroy');

        Route::get('{listing}', [BuyerController::class, 'showListing'])->name('show');
        Route::post('{listing}/make-offer', [OfferController::class, 'store'])->name('makeOffer');

    });


    Route::prefix('deals')->name('deals.')->group(function () {
        Route::get('/', [BuyerController::class, 'showAllDeals'])->name('index');
        Route::patch('/{deal}/make-deposit', [DealController::class, 'markDepositMade'])->name('markDepositMade');
        Route::patch('/{deal}/set-condition-day', [DealController::class, 'setConditionDay'])->name('setConditionDay');
        Route::patch('/{deal}/set-possession-day', [DealController::class, 'setPossessionDay'])->name('setPossessionDay');
    });

    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::get('/', [AppointmentController::class, 'index'])->name('index');
        Route::post('/', [AppointmentController::class, 'buyerCancel'])->name('cancel');

    });
});
