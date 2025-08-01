<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuyerController;
use App\Http\Controllers\OfferController;

// Buyer Dashboard & Listings
Route::prefix('buyer')->middleware(['auth', 'role:buyer'])->name('buyer.')->group(function () {
    Route::get('deals', [BuyerController::class, 'showAllDeals'])->name('deals.index');

    Route::prefix('listings')->name('listings.')->group(function () {
        Route::get('{listing}', [BuyerController::class, 'showListing'])->name('show');
        Route::post('{listing}/make-offer', [OfferController::class, 'store'])->name('makeOffer');
    });
});
