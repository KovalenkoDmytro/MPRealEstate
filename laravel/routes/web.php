<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Models\Deal;
use App\Http\Controllers\{BuyerController,
    LawyerController,
    ProfileController,
    RealEstateListingController,
    FavoriteListingController,
    DealFileController,
    DealController,
    SellerController};

// Public Home Route
Route::get('/', fn () =>
Inertia::render('Welcome', [
    'canLogin'       => Route::has('login'),
    'canRegister'    => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion'     => PHP_VERSION,
])
)->name('home');

// Shared Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Profile routes
    Route::prefix('profile')->name('profile.')->controller(ProfileController::class)->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });

    // Uncomment below when listings and favorites are used
    /*
    Route::prefix('listings')->name('listings.')->group(function () {
        Route::get('/', [RealEstateListingController::class, 'index'])->name('index');
        Route::get('/{listing}', [RealEstateListingController::class, 'show'])->name('show');
    });

    Route::prefix('favorites')->name('favorites.')->group(function () {
        Route::post('/', [FavoriteListingController::class, 'store'])->name('store');
        Route::delete('/{listing}', [FavoriteListingController::class, 'destroy'])->name('destroy');
    });
    */



    // Role-Based Dashboard Redirect
    Route::get('/dashboard', function () {
        $user = auth()->user();

        return match (true) {
            $user->hasRole('buyer')  => app(BuyerController::class)->index(),
            $user->hasRole('seller') => app(SellerController::class)->index(),
            $user->hasRole('lawyer') => app(LawyerController::class)->index(),

        };
    })->name('dashboard');


    // Deal Viewer by Role
    Route::get('/deals/{deal}', function (Deal $deal) {
        $user = auth()->user();

        return match (true) {
            $user->hasRole('buyer')  => app(BuyerController::class)->showDealView($deal),
            $user->hasRole('seller') => app(SellerController::class)->showDealView($deal),
            $user->hasRole('lawyer') => app(LawyerController::class)->showDealView($deal),

        };
    })->name('deals.show');


    // Buyer/Seller Shared Routes
    Route::middleware(['role:buyer|seller'])->group(function () {
        Route::post('/deals/{deal}/invite-lawyer', [DealController::class, 'inviteLawyer'])->name('deals.inviteLawyer');
        Route::post('/deals/{deal}/break/request', [DealController::class, 'breakDeal'])->name('deals.break.request');
    });

    // Shared File Routes for Buyer/Seller/Lawyer
    Route::middleware(['role:buyer|seller|lawyer'])->prefix('deals')->name('deals.')->group(function () {
        Route::post('/{deal}/files', [DealFileController::class, 'store'])->name('files.store');
        Route::get('/files/{file}/download', [DealFileController::class, 'download'])->name('files.download');
        Route::delete('/files/{file}', [DealFileController::class, 'destroy'])->name('files.destroy');
    });

});







// Laravel Breeze Auth Routes
require __DIR__.'/auth.php';
