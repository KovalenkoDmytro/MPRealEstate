<?php

namespace App\Providers;


use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Deal;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::define('view-deal', function (User $user, Deal $deal) {
            return $deal->users()->where('user_id', $user->id)->exists();
        });

        Route::middleware('web')
            ->group(function () {
                require base_path('routes/web.php');
                require base_path('routes/admin.php');
                require base_path('routes/buyer.php');
                require base_path('routes/seller.php');
                require base_path('routes/lawyer.php');
            });
    }
}
