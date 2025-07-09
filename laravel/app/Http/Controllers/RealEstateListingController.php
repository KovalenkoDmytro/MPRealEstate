<?php

namespace App\Http\Controllers;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Services\RealEstateListingService;
use App\Models\RealEstateListing;
use Exception;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\RealEstateListingRequest;
use Illuminate\Http\JsonResponse;

class RealEstateListingController extends Controller {
    private RealEstateListingService $listingService;

    public function __construct(RealEstateListingService $listingService)
    {
        $this->listingService = $listingService;
    }

    /**
     * List all real estate listings.
     */
    public function index(): Response {
        $user = auth()->user();
        $listings = RealEstateListing::with(['seller', 'mainImage'])->get();
        $favoriteListings = $user->favoriteListings()->pluck(
            'real_estate_listing_id'
        );
        return Inertia::render('RealEstateListings/Index', [
            'listings' => $listings,
            'favoriteListings' => $favoriteListings,
        ]);
    }

    public function create(): Response {
        return Inertia::render('Users/Seller/Listings/Create');
    }

    public function store(RealEstateListingRequest $request): JsonResponse {
        /** @var \App\Models\User $user */
        try{
            $user = auth()->user();
            // ✅ Only sellers can create listings
            if (!$user->hasRole('seller')) {
                abort(403, 'Unauthorized: Only sellers can create listings.');
            }

           $this->listingService->createListing($request, $user);

            return JsonResponder::send(
                new SuccessResponse('Listing created successfully!', [])
            );
        }
        catch(Exception $e){
            return JsonResponder::send(
                new ErrorResponse($e->getMessage())
            );
        }




    }
    /**
     * ✅ Show the edit form for a listing
     */
    public function edit(RealEstateListing $listing): Response {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // ✅ Ensure only the owner can edit the listing
        if ($listing->seller_id !== $user->id) {
            abort(403, 'Unauthorized: You do not own this listing.');
        }

        return Inertia::render('Users/Seller/Listings/Edit', [
            'listing' => $listing->load('mainImage', 'images'),
        ]);
    }
    /**
     * ✅ Handle the update request
     */
    public function update(RealEstateListingRequest $request, RealEstateListing $listing):JsonResponse {
        /** @var \App\Models\User $user */
        try {
            $user = auth()->user();
            if ($listing->seller_id !== $user->id) {
                abort(403, 'Unauthorized: You do not own this listing.');
            }

            $this->listingService->updateListing($request, $listing);

            return JsonResponder::send(
                new SuccessResponse('Listing updated successfully!', [])
            );
        }
        catch (Exception $e) {
            return JsonResponder::send(
                new ErrorResponse($e->getMessage())
            );
        }
    }

    public function softDelete(RealEstateListing $listing): JsonResponse {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // 1. 🔒 Check ownership
        if ($listing->seller_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // 2. ❌ Check if any deal exists and is not completed
        $hasActiveDeal = $listing->deal()->where('is_completed', false)->exists();

        if ($hasActiveDeal) {
            return JsonResponder::send(
                new ErrorResponse('Cannot delete listing with an active/incomplete deal.')
            );
        }

        // 3. 🔄 Soft-delete logic: set status to inactive and 📦 Clean up: delete all gallery images (keep only main)

        $this->listingService->deactivateListing($listing);

        return JsonResponder::send(
            new SuccessResponse('Listing deactivated and gallery images removed')
        );

    }


}
