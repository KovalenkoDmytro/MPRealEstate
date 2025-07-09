<?php

namespace App\Services;

use App\Models\RealEstateListing;
use App\Models\User;
use App\Http\Requests\ListingFilterRequest;

class BuyerService
{
    public function getFilteredListings(User $user, ListingFilterRequest $request)
    {
        $query = RealEstateListing::query()
            ->where('status', '!=', 'inactive')
            ->with(['seller', 'mainImage']);

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', $request->bedrooms);
        }

        if ($request->filled('bathrooms')) {
            $query->where('bathrooms', '>=', $request->bathrooms);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->boolean('favorites_only')) {
            $query->whereIn('id', $user->favoriteListings()->pluck('real_estate_listing_id'));
        }

        return $query->latest()->paginate(9)->withQueryString();
    }

    public function getListingWithUserOffer(int $listingId, User $user): array {
        $listing = RealEstateListing::with('seller', 'images', 'mainImage', 'deal:id,real_estate_listing_id')
            ->findOrFail($listingId);

        $userOffer = $listing->offers()
            ->where('buyer_id', $user->id)
            ->latest()
            ->first();

        return compact('listing', 'userOffer');
    }
}
