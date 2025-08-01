<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Http\Controllers\{
    ProfileController,
    DashboardController,
    DealFileController,
    DealController,
    RealEstateListingController
};

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

    // Role-Based Dashboard
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Deal Viewer
    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');

    // Buyer/Seller shared routes
    Route::middleware(['role:buyer|seller'])->group(function () {
        Route::post('/deals/{deal}/invite-lawyer', [DealController::class, 'inviteLawyer'])->name('deals.inviteLawyer');
        Route::post('/deals/{deal}/break/request', [DealController::class, 'breakDeal'])->name('deals.break.request');
    });

    // Buyer/Seller/Lawyer shared file routes
    Route::middleware(['role:buyer|seller|lawyer'])->prefix('deals')->name('deals.')->group(function () {
        Route::post('/{deal}/files', [DealFileController::class, 'store'])->name('files.store');
        Route::get('/files/{file}/download', [DealFileController::class, 'download'])->name('files.download');
        Route::delete('/files/{file}', [DealFileController::class, 'destroy'])->name('files.destroy');
    });

    // Listings route (all roles)
    Route::middleware(['role:buyer|seller|admin'])
        ->prefix('listings')
        ->name('listings.')
        ->group(function () {
            Route::get('/', [RealEstateListingController::class, 'index'])->name('index');
        });
});

// Laravel Breeze Auth Routes
require __DIR__.'/auth.php';
require __DIR__.'/seller.php';
require __DIR__.'/buyer.php';
require __DIR__.'/admin.php';
require __DIR__.'/lawyer.php';
