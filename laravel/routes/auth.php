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

// Login
Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('login', [AuthenticatedSessionController::class, 'store']);

// Register
Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('register', [RegisteredUserController::class, 'store']);

// Forgot Password
Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

// Reset Password
Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');

// Confirm Password
Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

// Verify Email
Route::get('verify-email', [EmailVerificationPromptController::class, '__invoke'])->name('verification.notice');
Route::get('verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])->name('verification.verify');
Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->name('verification.send');

// Logout
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
