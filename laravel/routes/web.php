<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Models\Deal;
use App\Models\User;
use App\Models\RealEstateListing;
use App\Http\Controllers\{NotificationController,
    OfferController,
    ProfileController,
    DashboardController,
    DealFileController,
    DealController,
    BuyerController,
    SellerController,
    RealEstateListingController};
use App\Http\Controllers\AppointmentController;

// Public Demo Route
Route::get('/demo', \App\Actions\Demo\ShowDemoPage::class)->name('demo');

// Public Home Route
Route::get('/', static function () {
    $stats = Cache::remember('welcome.stats', now()->addMinutes(15), static function (): array {
        return [
            'users' => User::count(),
            'listings' => RealEstateListing::count(),
            'deals' => Deal::where('is_broken', false)->count(),
        ];
    });

    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
        'stats'          => $stats,
    ]);
})->name('home');

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

    // This endpoint returns lightweight JSON specifically for the 5000+ map pins
    Route::get('/api/map-listings', [RealEstateListingController::class, 'mapData'])->name('api.map-listings');

    // Role-specific routes (loaded before wildcards so specific paths like /listings/favorites match first)
    require __DIR__.'/seller.php';
    require __DIR__.'/buyer.php';

    // Role-dispatched routes (same URL for buyer and seller, different handler)
    Route::middleware(['role:buyer|seller'])->group(function () {
        Route::get('/deals', function () {
            return auth()->user()->hasRole('buyer')
                ? app(BuyerController::class)->showAllDeals()
                : app(SellerController::class)->showAllDeals();
        })->name('deals.index');

        Route::get('/listings/{listing}', function (RealEstateListing $listing) {
            return auth()->user()->hasRole('buyer')
                ? app(BuyerController::class)->showListing($listing)
                : app(SellerController::class)->showListing($listing);
        })->name('listings.show');

        Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
    });


    //Appointment confirmation
    Route::middleware(['role:buyer|seller'])->group(function () {
        // Buyer schedules
        Route::post('/appointments/create', [AppointmentController::class, 'store'])->name('appointments.store');

        //my all offers
        Route::get('/offers', [OfferController::class, 'index'])->name('offers.index');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/notifications', [NotificationController::class, 'index'])
            ->name('notifications.index');

        Route::post('/notifications/{id}/read', [NotificationController::class, 'read'])
            ->name('notifications.readOne');

        Route::post('/notifications/read-all', [NotificationController::class, 'readAll'])
            ->name('notifications.readAll');
    });

});

// Laravel Breeze Auth Routes
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/lawyer.php';
