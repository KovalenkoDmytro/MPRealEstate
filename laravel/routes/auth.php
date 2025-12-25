<?php

use App\Http\Controllers\Auth\{
    AuthenticatedSessionController,
    RegisteredUserController,
    PasswordResetLinkController,
    NewPasswordController,
    ConfirmablePasswordController,
    EmailVerificationNotificationController,
    VerifyEmailController,
    EmailVerificationPromptController
};
use Illuminate\Support\Facades\Route;

// GUEST ROUTES: For users who are NOT logged in.
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});
// After registration — show “check your email” screen
Route::get('verify-email', static function () {
    return inertia('Auth/VerifyEmail', [
        'message' => session('message', 'Please check your email to verify your account.')
    ]);
})->middleware('guest')->name('verification.notice');


// AUTHENTICATED ROUTES: For users who ARE logged in.
Route::middleware('auth')->group(function () {


    // This route needs to know which logged-in user to send the email to.
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // As you said, logout must be protected.
    Route::get('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Optional but recommended: Password confirmation for logged-in users.
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
});


// This route has special middleware and can be separate.
// A logged-in user is redirected here from their email link to finalize verification.
Route::get('verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware([ 'throttle:6,1'])
    ->name('verification.verify');


Route::post('/resend-verification-link', [EmailVerificationNotificationController::class, 'store'])
    ->name('verification.resend');
