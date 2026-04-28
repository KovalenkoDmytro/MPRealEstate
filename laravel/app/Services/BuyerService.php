<?php

declare(strict_types=1);

namespace App\Services;

use App\Filters\ListingFilter;
use App\Http\Requests\ListingFilterRequest;
use App\Models\Deal;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Pagination\LengthAwarePaginator;

class BuyerService
{
    public function getFilteredListings(User $user, ListingFilterRequest $request): LengthAwarePaginator|AbstractPaginator {
        $query = RealEstateListing::query()
            ->where('status', 'available')
            ->with(['seller', 'mainImage', 'images']);
        $query = ListingFilter::apply($query, $request->validated(), $user);

        return $query->latest()->paginate(9)->withQueryString();
    }

    public function getListingWithUserOffer(int $listingId, User $user): array {
        $latestBrokenAt = Deal::query()
            ->where('real_estate_listing_id', $listingId)
            ->where('is_broken', true)
            ->whereNotNull('broken_at')
            ->latest('broken_at')
            ->value('broken_at');

        $listing = RealEstateListing::with([
            'seller',
            'images',
            'mainImage',
            'deal:id,real_estate_listing_id',
            'appointments' => static function ($query) use ($latestBrokenAt, $user): void {
                $query->where('buyer_id', $user->getKey());

                if ($latestBrokenAt !== null) {
                    $query->where('created_at', '>', $latestBrokenAt);
                }
            },
        ])
            ->findOrFail($listingId);

        $userOfferQuery = $listing->offers()
            ->where('buyer_id', $user->id)
            ->latest();

        if ($latestBrokenAt !== null) {
            $userOfferQuery->where('created_at', '>', $latestBrokenAt);
        }

        $userOffer = $userOfferQuery->first();

        return compact('listing', 'userOffer');
    }
}
