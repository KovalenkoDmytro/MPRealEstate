<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Models\Deal;
use App\Http\Controllers\{
    ProfileController,
    RealEstateListingController,
    FavoriteListingController,
    DealFileController,
    DealController
};

// Public Home
Route::get('/', fn () =>
Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
])
)->name('home');

// Shared Authenticated
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('listings')->name('listings.')->group(function () {
        Route::get('/', [RealEstateListingController::class, 'index'])->name('index');
//        Route::get('/{listing}', [RealEstateListingController::class, 'show'])->name('show');
    });

    Route::prefix('favorites')->name('favorites.')->group(function () {
        Route::post('/', [FavoriteListingController::class, 'store'])->name('store');
        Route::delete('/{listing}', [FavoriteListingController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('profile')->name('profile.')->controller(ProfileController::class)->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });
});

// Role-based dashboard redirect
Route::middleware('auth')->get('/dashboard', function () {
    $user = auth()->user();

    return match (true) {
        $user->hasRole('admin')  => app(\App\Http\Controllers\AdminController::class)->index(),
        $user->hasRole('buyer')  => app(\App\Http\Controllers\BuyerController::class)->index(),
        $user->hasRole('seller') => app(\App\Http\Controllers\SellerController::class)->index(),
        $user->hasRole('lawyer') => app(\App\Http\Controllers\LawyerController::class)->index(),
        default => abort(403, 'Unauthorized')
    };
})->name('dashboard');

// Deal Viewer by role
Route::middleware('auth')->get('/deals/{deal}', function (Deal $deal) {
    $user = auth()->user();

    return match (true) {
        $user->hasRole('buyer')  => app(\App\Http\Controllers\BuyerController::class)->showDealView($deal),
        $user->hasRole('seller') => app(\App\Http\Controllers\SellerController::class)->showDealView($deal),
        $user->hasRole('lawyer') => app(\App\Http\Controllers\LawyerController::class)->showDealView($deal),
        default => abort(403, 'Unauthorized')
    };
})->name('deals.show');

// Shared file routes
Route::middleware(['auth', 'role:buyer|seller|lawyer'])->prefix('deals')->name('deals.')->group(function () {
    Route::post('/{deal}/files', [DealFileController::class, 'store'])->name('files.store');
    Route::get('/files/{file}/download', [DealFileController::class, 'download'])->name('files.download');
    Route::delete('/files/{file}', [DealFileController::class, 'destroy'])->name('files.destroy');
});

// Shared invite
Route::post('/deals/{deal}/invite-lawyer', [DealController::class, 'inviteLawyer'])
    ->middleware(['auth', 'role:buyer|seller'])
    ->name('deals.inviteLawyer');

// Auth scaffolding
require __DIR__.'/auth.php';
