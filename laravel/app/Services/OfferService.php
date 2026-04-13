<?php

declare(strict_types=1);

namespace App\Services;

use App\Actions\Deals\CreateDealFromOfferAction;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use App\Notifications\OfferConfirmation;
use App\Notifications\OfferStatusUpdated;
use App\Notifications\OfferSubmitted;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class OfferService
{
    public function submitOffer(int|float $amount, string $message, User $buyer, RealEstateListing $listing): void
    {
        $offer = Offer::query()->create([
            'real_estate_listing_id' => $listing->getKey(),
            'buyer_id' => $buyer->getKey(),
            'amount' => $amount,
            'message' => $message,
            'status' => 'pending',
        ]);

        $listing->seller->notify(new OfferSubmitted($listing, $buyer, $offer));
        $buyer->notify(new OfferConfirmation($listing, $offer));
    }

    public function updateStatus(string $status, User $authorizer, Offer $offer): void
    {
        if ($offer->listing->seller_id !== $authorizer->getKey()) {
            throw new \RuntimeException(__('global.errors.unauthorized'));
        }

        if ($status === 'accepted') {
            CreateDealFromOfferAction::run($offer);
        }

        $offer->update(['status' => $status]);

        $offer->buyer->notify(new OfferStatusUpdated($offer->listing, $status));
    }

    public function getAllUserOffers(User $user, int $perPage = 10): LengthAwarePaginator
    {

        $query = Offer::with('listing.mainImage')->latest();

        if ($user->hasRole('seller')) {
            $query->whereHas('listing', fn ($q) => $q->where('seller_id', $user->getKey()))
                ->with('buyer');
        } elseif ($user->hasRole('buyer')) {
            $query->where('buyer_id', $user->getKey())
                ->with('listing.seller');
        } else {
            return new LengthAwarePaginator([], 0, $perPage);
        }

        return $query->paginate($perPage);
    }

    /**
     * Get aggregated Offer statistics (Efficient Query Builder Approach).
     */
    public function getUserOfferStats(User $user): array
    {

        $query = Offer::query();

        if ($user->hasRole('seller')) {

            $query->whereHas('listing', function ($q) use ($user) {
                $q->where('seller_id', $user->getKey());
            });
        } elseif ($user->hasRole('buyer')) {

            $query->where('buyer_id', $user->getKey());
        } else {
            return ['total' => 0, 'pending' => 0, 'accepted' => 0, 'rejected' => 0];
        }

        return $this->calculateStats($query);
    }

    /**
     * Helper to count statuses without loading objects into memory.
     */
    private function calculateStats(Builder $baseQuery): array
    {
        return [
            'total' => (clone $baseQuery)->count(),

            'pending' => (clone $baseQuery)
                ->where('status', 'pending')
                ->count(),

            'accepted' => (clone $baseQuery)
                ->where('status', 'accepted')
                ->count(),

            'rejected' => (clone $baseQuery)
                ->where('status', 'rejected')
                ->count(),
        ];
    }
}
