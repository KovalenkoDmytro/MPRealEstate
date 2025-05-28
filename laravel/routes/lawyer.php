<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:lawyer'])->prefix('lawyer')->name('lawyer.')->group(function () {
    Route::get('/', fn () => Inertia::render('Users/Lawyer/Dashboard'))->name('dashboard');
});
