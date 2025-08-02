<?php

namespace App\Http\Controllers;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Http\Requests\ListingFilterRequest;
use App\Models\User;
use App\Services\BuyerService;
use App\Services\DealService;
use App\Services\RealEstateListingService;
use App\Models\RealEstateListing;
use App\Services\SellerService;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\RealEstateListingRequest;
use Illuminate\Http\JsonResponse;

class RealEstateListingController extends Controller {
    use AuthorizesRequests;

    private RealEstateListingService $listingService;
    private SellerService $dealService;
    private BuyerService $buyerService;

    public function __construct(RealEstateListingService $listingService, SellerService $sellerService, BuyerService $buyerService)
    {
        $this->listingService = $listingService;
        $this->sellerService = $sellerService;
        $this->buyerService = $buyerService;
    }

    /**
     * List all real estate listings.
     */
    public function index(ListingFilterRequest $request): Response {
        $this->authorize('viewAny', RealEstateListing::class);

        return $this->renderViewForRole(auth()->user(), $request);
    }

    public function create(): Response {
        return Inertia::render('Users/Seller/Listings/Create');
    }

    public function store(RealEstateListingRequest $request): JsonResponse {
        try{
            $this->authorize('create', RealEstateListing::class);

            $this->listingService->createListing($request);

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

    public function edit(RealEstateListing $listing): Response {

        $this->authorize('update', $listing);

        return Inertia::render('Users/Seller/Listings/Edit', [
            'listing' => $listing->load('mainImage', 'images'),
        ]);
    }

    public function update(RealEstateListingRequest $request, RealEstateListing $listing):JsonResponse {
        /** @var \App\Models\User $user */
        try {
            $this->authorize('update', $listing);

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
        $this->authorize('delete', $listing);


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

    private function renderViewForRole(User $user, ListingFilterRequest $request): Response
    {
        $role = strtolower($user->role);

        return match ($role) {
            'seller' => Inertia::render('Users/Seller/Listings/Index', [
                'listings' => $this->sellerService->getSellerListings(),
            ]),
            'buyer' => Inertia::render('Users/Buyer/Listings/Index', [
                'listings' => $this->buyerService->getFilteredListings($user, $request),
                'favoriteListings' => $this->listingService->getFavoriteListingIds($user),
                'filters' => $request->validatedFilters(),
            ]),
            'admin' => Inertia::render('Users/Admin/Listings/Index', [
                'listings' => RealEstateListing::with(['seller', 'mainImage'])->get(),
                'favoriteListings' => $this->listingService->getFavoriteListingIds($user),
            ]),
            default => abort(403, 'Unauthorized role'),
        };
    }



}
