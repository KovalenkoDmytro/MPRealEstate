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
Route::get('/', static fn () =>
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


    // Notifications (read + window)
    Route::post('/notifications/{id}/read', function (string $id) {
        $n = auth()->user()->notifications()->where('id', $id)->firstOrFail();
        if (is_null($n->read_at)) $n->markAsRead();
        return back();
    })->name('notifications.readOne');

    Route::post('/notifications/read-all', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.readAll');

// Optional dedicated window/page (Inertia + React)
    Route::get('/notifications/window', function () {
        $u = auth()->user();
        return Inertia::render('Notifications/Window', [
            'notifications' => [
                'unread_count' => $u->unreadNotifications()->count(),
                'items' => $u->notifications()->latest()->take(100)->get()->map(fn($n) => [
                    'id'         => $n->id,
                    'title'      => $n->data['title'] ?? 'Notification',
                    'body'       => $n->data['body'] ?? '',
                    'url'        => $n->data['url'] ?? null,
                    'read_at'    => optional($n->read_at)?->toISOString(),
                    'created_at' => $n->created_at->toISOString(),
                ]),
            ],
        ]);
    })->name('notifications.window');
});

// Laravel Breeze Auth Routes
require __DIR__.'/auth.php';
require __DIR__.'/seller.php';
require __DIR__.'/buyer.php';
require __DIR__.'/admin.php';
require __DIR__.'/lawyer.php';
