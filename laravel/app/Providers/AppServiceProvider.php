<?php

namespace App\Providers;

use App\Models\Deal;
use App\Models\Lawyer;
use App\Models\RealEstateListing;
use App\Models\User;
use App\Policies\RealEstateListingPolicy;
use App\Services\LawyerService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

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
        Vite::prefetch(concurrency: 3);

        Gate::define('view-deal', static function (User $user, Deal $deal) {
            return $deal->users()->where('user_id', $user->id)->exists();
        });

        Inertia::share([
            'notifications' => function () {
                if (! Auth::check()) {
                    return null;
                }
                $u = Auth::user();

                return [
                    'unread_count' => $u->unreadNotifications()->count(),
                    'items' => $u->unreadNotifications()
                        ->latest()
                        ->take(15)
                        ->get()
                        ->map(fn ($n) => [
                            'id' => $n->id,
                            'title' => $n->data['title'] ?? '',
                            'body' => $n->data['body'] ?? '',
                            'url' => $n->data['url'] ?? null,
                            'read_at' => $n->read_at?->toISOString(),
                            'created_at' => $n->created_at->toISOString(),
                        ])
                        ->values()
                        ->all(),
                ];
            },
        ]);

    }
}
