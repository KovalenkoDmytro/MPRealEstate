<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DealController;
use App\Http\Controllers\FavoriteListingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuyerController;
use App\Http\Controllers\OfferController;

Route::middleware(['auth', 'role:buyer'])->group(function () {
    Route::prefix('listings')->name('listings.')->group(function () {
        Route::get('/favorites', [FavoriteListingController::class, 'index'])->name('favorites.index');
        Route::post('/favorites', [FavoriteListingController::class, 'store'])->name('favorites.store');
        Route::delete('/favorites/{listing}', [FavoriteListingController::class, 'destroy'])->name('favorites.destroy');
        Route::post('{listing}/make-offer', [OfferController::class, 'store'])->name('makeOffer');
    });

    Route::prefix('deals')->name('deals.')->group(function () {
        Route::patch('/{deal}/make-deposit', [DealController::class, 'markDepositMade'])->name('markDepositMade');
        Route::patch('/{deal}/set-condition-day', [DealController::class, 'setConditionDay'])->name('setConditionDay');
        Route::patch('/{deal}/set-possession-day', [DealController::class, 'setPossessionDay'])->name('setPossessionDay');
    });

    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::post('/cancel', [AppointmentController::class, 'buyerCancel'])->name('cancel');
    });
});
