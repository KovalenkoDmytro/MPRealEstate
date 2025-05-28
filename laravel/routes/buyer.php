<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{BuyerController, OfferController, DealController};

Route::middleware(['auth', 'role:buyer'])->prefix('buyer')->name('buyer.')->group(function () {
    Route::post('/listings/{listing}/make-offer', [OfferController::class, 'store'])->name('makeOffer');
    Route::get('/deals', [BuyerController::class, 'showAllDeals'])->name('deals.all');

    Route::patch('/deals/{deal}/make-deposit', [DealController::class, 'markDepositMade'])->name('deals.markDepositMade');
    Route::patch('/deals/{deal}/set-condition-day', [DealController::class, 'setConditionDay'])->name('deals.setConditionDay');
    Route::patch('/deals/{deal}/set-possession-day', [DealController::class, 'setPossessionDay'])->name('deals.setPossessionDay');
});
