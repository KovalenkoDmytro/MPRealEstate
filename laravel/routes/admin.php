<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', fn () =>
    Inertia::render('Users/Admin/Dashboard')
    )->name('admin.dashboard');
});
