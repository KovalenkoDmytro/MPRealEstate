<?php

namespace App\Providers;

use App\Models\Buyer;
use App\Models\Deal;
use App\Models\Lawyer;
use App\Models\RealEstateListing;
use App\Models\Seller;
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
            'u' => Auth::user(),
            'notifications' => function () {
                if (! Auth::check()) {
                    return null;
                }

                $user = Auth::user();
                $types = [
                    get_class($user),
                    User::class,
                    Seller::class,
                    Buyer::class,
                    Lawyer::class,
                ];

                return [
                    'unread_count' => \DB::table('notifications')
                        ->whereIn('notifiable_type', $types)
                        ->where('notifiable_id', $user->id)
                        ->whereNull('read_at')
                        ->count(),
                    'items' => \DB::table('notifications')
                        ->whereIn('notifiable_type', $types)
                        ->where('notifiable_id', $user->id)
                        ->latest()
                        ->take(15)
                        ->get()
                        ->map(fn ($n) => [
                            'id' => $n->id,
                            'title' => json_decode($n->data, true, 512, JSON_THROW_ON_ERROR)['title'] ?? '',
                            'body' => json_decode($n->data, true, 512, JSON_THROW_ON_ERROR)['body'] ?? '',
                            'url' => json_decode($n->data, true, 512, JSON_THROW_ON_ERROR)['url'] ?? null,
                            'read_at' => $n->read_at,
                            'created_at' => $n->created_at,
                        ]),
                ];
            },
        ]);

    }
}
