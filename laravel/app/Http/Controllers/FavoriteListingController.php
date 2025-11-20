<?php

namespace App\Http\Controllers;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Services\FavoriteListingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\RealEstateListing;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteListingController extends Controller
{
    private FavoriteListingService $favoriteListingService;

    public function __construct(FavoriteListingService $favoriteListingService)
    {
        $this->favoriteListingService = $favoriteListingService;
    }

    public function index(Request $request): Response {
        $user = $request->user();
        $favorites = $this->favoriteListingService->getFavorites($user);

        return Inertia::render('Users/Buyer/FavoriteListing/Index', [
            'favoriteListings' => $favorites
        ]);

    }

    public function store(Request $request): JsonResponse {
        $user = $request->user();
        $listingId = $request->input('listing_id');

        $this->favoriteListingService->addToFavorites($user, $listingId);


        return JsonResponder::send(
            new SuccessResponse('Added to favorites', ['favorite' => true])
        );

    }

    public function destroy(Request $request, RealEstateListing $listing): JsonResponse {
        $this->favoriteListingService->removeFromFavorites($request->user(), $listing);

        return JsonResponder::send(
            new SuccessResponse('Added to favorites', ['favorite' => false])
        );
    }
}
