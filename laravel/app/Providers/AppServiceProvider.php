<?php

namespace App\Providers;

use App\Models\Deal;
use App\Models\Lawyer;
use App\Models\RealEstateListing;
use App\Models\User;
use App\Policies\RealEstateListingPolicy;
use App\Services\LawyerService;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        RealEstateListing::class => RealEstateListingPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind LawyerService per-request with the authenticated user attached
        $this->app->scoped(LawyerService::class, static function () {
            $user = Auth::user();

            return new LawyerService(
                new Lawyer($user->getAttributes()) // re-wrap User as Lawyer
            );
        });

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->ensureStorageDirectoriesExist();

        Gate::define('view-deal', static function (User $user, Deal $deal) {
            return $deal->users()->where('user_id', $user->id)->exists();
        });
    }

    protected function ensureStorageDirectoriesExist(): void
    {
        $directories = [
            storage_path('framework/cache/data'),
            storage_path('framework/sessions'),
            storage_path('framework/testing'),
            storage_path('framework/views'),
            storage_path('logs'),
        ];

        foreach ($directories as $directory) {
            if (! File::isDirectory($directory)) {
                File::ensureDirectoryExists($directory);
            }
        }
    }
}
