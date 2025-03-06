<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DealController;
use App\Http\Controllers\RealEstateListingController;

// Public Home Route
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Authenticated Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // RealEstateListing pages
    Route::get('/listings', [RealEstateListingController::class, 'index'])->name('listings.index');
    Route::get('/listings/{listing}', [RealEstateListingController::class, 'show'])->name('listings.show');

    // User Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Dashboard (Only for Admins)

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('Users/Admin/Dashboard'); // Use Inertia for Vue
    })->name('admin.dashboard');


    // List all deals
//    Route::get('/deals', [DealController::class, 'index'])->name('deals.index');
    // Show a single deal
//    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');

});

// Buyer Dashboard (Only for Buyers)
Route::middleware(['auth', 'role:buyer'])->group(function () {
    Route::get('/buyer', function () {
        return Inertia::render('Users/Buyer/Dashboard');
    })->name('buyer.dashboard');

    // Show a single deal
//    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');
});

// Seller Dashboard (Only for Sellers)
Route::middleware(['auth', 'role:seller'])->group(function () {
    Route::get('/seller', function () {
        return Inertia::render('Users/Seller/Dashboard');
    })->name('seller.dashboard');

    // Show a single deal
//    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');
});

// Lawyer Dashboard (Only for Lawyers)
Route::middleware(['auth', 'role:lawyer'])->group(function () {
    Route::get('/lawyer', function () {
        return Inertia::render('Users/Lawyer/Dashboard');
    })->name('lawyer.dashboard');

    // Show a single deal
//    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');
});

// Include Authentication Routes
require __DIR__.'/auth.php';

Route::middleware(['auth', 'role:admin|buyer|seller|lawyer'])->group(function () {
    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');
});

Route::middleware(['auth', 'role:seller'])->group(function () {
    Route::get('/listing/create', [RealEstateListingController::class, 'create'])->name('listings.create');
    Route::post('/listings', [RealEstateListingController::class, 'store'])->name('listings.store');
});



// todo Move deal to next step only after confirmation from both (seller/buyer) till lawyer in play
//Route::post('/deals/{deal}/next-step', [DealController::class, 'moveToNextStep'])->name('deals.next-step');
//


