<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     */
    public const string HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot(): void
    {

        $this->routes(function () {
            Route::middleware('web')
                ->group(function () {
                    require base_path('routes/web.php');
                    require base_path('routes/admin.php');
                    require base_path('routes/buyer.php');
                    require base_path('routes/seller.php');
                    require base_path('routes/lawyer.php');
                });
        });
    }

}
