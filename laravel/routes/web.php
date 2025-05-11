<?php

use App\Http\Controllers\BuyerController;
use App\Http\Controllers\DealFileController;
use App\Http\Controllers\LawyerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\SellerController;
use App\Models\Deal;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DealController;
use App\Http\Controllers\RealEstateListingController;
use App\Http\Controllers\FavoriteListingController;

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
//    Route::get('/dashboard', function () {
//        return Inertia::render('Dashboard');
//    })->name('dashboard');

    // RealEstateListing pages
    Route::get('/listings', [RealEstateListingController::class, 'index'])->name('listings.index');
    Route::get('/listings/{listing}', [RealEstateListingController::class, 'show'])->name('listings.show');


    //Add listing to favorite
    Route::post('/favorites', [FavoriteListingController::class, 'store'])->name('favorites.store');
    Route::delete('/favorites/{listing}', [FavoriteListingController::class, 'destroy'])->name('favorites.destroy');


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

Route::middleware(['auth'])->group(function () {


    Route::get('/dashboard', function ()  {
        $user = auth()->user();

        // ✅ Redirect users based on role
        if ($user->hasRole('admin')) {
            dd('admin');
//            return app(AdminController::class)->index();
        } elseif ($user->hasRole('buyer')) {
            return app(BuyerController::class)->index();
        } elseif ($user->hasRole('seller')) {
            return app(SellerController::class)->index();
        } elseif ($user->hasRole('lawyer')) {
            return app(LawyerController::class)->index();
        }

        abort(403, 'Unauthorized');
    })->name('dashboard');
//    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');

    Route::get('/deals/{deal}', function (Deal $deal) {
        $user = auth()->user();

        // ✅ Redirect users based on role
        if ($user->hasRole('admin')) {

        } elseif ($user->hasRole('buyer')) {
            return app(BuyerController::class)->showDealView($deal);
        } elseif ($user->hasRole('seller')) {
            return app(SellerController::class)->showDealView($deal);
        } elseif ($user->hasRole('lawyer')) {
            return app(LawyerController::class)->showDealView($deal);
        }

        abort(403, 'Unauthorized');
    })->name('deals.show');



});

Route::middleware(['auth', 'role:buyer|seller|lawyer'])->group(function () {
    Route::post('/deals/{deal}/files', [DealFileController::class, 'store'])->name('deals.files.store');
    Route::get('/files/{file}/download', [DealFileController::class, 'download'])->name('deals.files.download');
    Route::delete('/files/{file}', [DealFileController::class, 'destroy'])->name('deals.files.destroy');
});


// Buyer Dashboard (Only for Buyers)
Route::middleware(['auth', 'role:buyer'])->group(function () {
//    Route::get('/dashboard', [BuyerController::class, 'index'])->name('buyer.dashboard');

    //Routing to make offer about RElisting
    Route::post('/listings/{listing}/make-offer', [OfferController::class, 'store']);

    // Show a single deal
//    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');

    Route::patch('/deals/{deal}/make-deposit', [DealController::class, 'markDepositMade'])->name('deals.markDepositMade');

    Route::patch('/deals/{deal}/set-condition-day', [DealController::class, 'setConditionDay'])->name('deals.setConditionDay');
    Route::patch('/deals/{deal}/set-possession-day', [DealController::class, 'setPossessionDay'])->name('deals.setPossessionDay');
    //todo i think better change underscore to minus


});


// Seller Dashboard (Only for Sellers)
Route::middleware(['auth', 'role:seller'])->group(function () {
//    Route::get('/dashboard', [SellerController::class, 'index'])->name('seller.dashboard');

    //Make change status of offer (update oppfer)
    Route::patch('/offers/{offer}/update-status', [OfferController::class, 'updateStatus']);


    Route::get('/deals',[SellerController::class, 'showAllDeals'])->name('deals.all');
    // Show a single deal
//    Route::get('/deals/{deal}', [DealController::class, 'show'])->name('deals.show');

    Route::get('/listing/create', [RealEstateListingController::class, 'create'])->name('listings.create');
    Route::post('/listings', [RealEstateListingController::class, 'store'])->name('listings.store');
    Route::get('/listings/{listing}/edit', [RealEstateListingController::class, 'edit'])->name('listings.edit');
    Route::post('/listings/{listing}/update', [RealEstateListingController::class, 'update'])->name('listings.update');



    Route::patch('/deals/{deal}/set-deposit', [DealController::class, 'setDeposit'])->name('deals.setDeposit');

    Route::post('/deals/{deal}/confirm-deposit', [DealController::class, 'confirmDeposit'])->name('deals.confirmDeposit');

    Route::patch('/deals/{deal}/confirm-condition-day', [DealController::class, 'confirmConditionDay'])->name('deals.confirmConditionDay');;
    Route::patch('/deals/{deal}/confirm-possession-day', [DealController::class, 'confirmPossessionDay'])->name('deals.confirmPossessionDay');;


});

Route::post('/deals/{deal}/invite-lawyer', [DealController::class, 'inviteLawyer'])
    ->middleware(['auth', 'role:buyer|seller'])
    ->name('deals.inviteLawyer');



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
    Route::get('/listings', [RealEstateListingController::class, 'index'])->name('listings.index');

});





// todo Move deal to next step only after confirmation from both (seller/buyer) till lawyer in play
//Route::post('/deals/{deal}/next-step', [DealController::class, 'moveToNextStep'])->name('deals.next-step');
//

//todo make  same url /dashboard for different roles show different pages dashboards









