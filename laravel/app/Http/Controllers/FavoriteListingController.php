<?php

namespace App\Http\Controllers;
use App\Services\FavoriteListingService;
use Illuminate\Http\Request;
use App\Models\RealEstateListing;

class FavoriteListingController extends Controller
{
    private FavoriteListingService $favoriteListingService;

    public function __construct(FavoriteListingService $favoriteListingService)
    {
        $this->favoriteListingService = $favoriteListingService;
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $user = $request->user();
        $listingId = $request->input('listing_id');

        $this->favoriteListingService->addToFavorites($user, $listingId);

        return back();
    }

    public function destroy(Request $request, RealEstateListing $listing): \Illuminate\Http\RedirectResponse
    {
        $this->favoriteListingService->removeFromFavorites($request->user(), $listing);

        return back();
    }
}
