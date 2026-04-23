<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Http\Requests\ListingFilterRequest;
use App\Http\Requests\RealEstateListingRequest;
use App\Models\RealEstateListing;
use App\Models\User;
use App\Services\BuyerService;
use App\Services\RealEstateListingService;
use App\Services\SellerService;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RealEstateListingController extends Controller {
    use AuthorizesRequests;

    private RealEstateListingService $listingService;
    private SellerService $sellerService;
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
        return Inertia::render('Users/Seller/Listings/Create', [
            'listingImageMaxBytes' => $this->resolveEffectiveListingImageMaxBytes(),
        ]);
    }

    public function store(RealEstateListingRequest $request): JsonResponse {
        try {
            $this->authorize('create', RealEstateListing::class);

            $this->listingService->createListing(
                data: $request->safe()->except(['main_image', 'gallery_images', 'remove_images', 'remove_main_image']),
                seller: $request->user(),
                mainImage: $request->file('main_image'),
                galleryImages: $request->file('gallery_images') ?? [],
                removeImageIds: $request->input('remove_images', []),
            );

            return JsonResponder::send(new SuccessResponse(__('listings.success.created')));
        } catch (Exception $e) {
            return JsonResponder::send(new ErrorResponse($e->getMessage()));
        }
    }

    public function edit(RealEstateListing $listing): Response {

        if ($listing->trashed()) {
            return Inertia::render('Users/Seller/Listings/Deleted');
        }

        $this->authorize('update', $listing);

        return Inertia::render('Users/Seller/Listings/Edit', [
            'listing' => $listing->load('mainImage', 'images'),
            'listingImageMaxBytes' => $this->resolveEffectiveListingImageMaxBytes(),
        ]);
    }

    public function update(RealEstateListingRequest $request, RealEstateListing $listing): JsonResponse {
        try {
            $this->authorize('update', $listing);

            $this->listingService->updateListing(
                data: $request->safe()->except(['main_image', 'gallery_images', 'remove_images', 'remove_main_image']),
                listing: $listing,
                mainImage: $request->file('main_image'),
                galleryImages: $request->file('gallery_images') ?? [],
                removeImageIds: $request->input('remove_images', []),
            );

            return JsonResponder::send(new SuccessResponse(__('listings.success.updated')));
        } catch (Exception $e) {
            return JsonResponder::send(new ErrorResponse($e->getMessage()));
        }
    }

    public function softDelete(RealEstateListing $listing): JsonResponse {
        $this->authorize('delete', $listing);


        // 2. Block only if deal is truly active (not completed and not broken)
        $hasActiveDeal = $listing->deal()
            ->where('is_completed', false)
            ->where('is_broken', false)
            ->exists();

        if ($hasActiveDeal) {
            return JsonResponder::send(
                new ErrorResponse(__('listings.errors.delete_failed'))
            );
        }

        // 3. Soft-delete

        $this->listingService->deactivateListing($listing);

        return JsonResponder::send(
            new SuccessResponse(__('listings.success.deactivated'))
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
        };
    }

    /**
     * Returns a lightweight JSON payload for the Mapbox 3D Map
     */
    public function mapData(Request $request)
    {
        $listings = RealEstateListing::select('id', 'title', 'price', 'latitude', 'longitude')
            ->with(['mainImage' => function($query) {

                $query->select('id', 'real_estate_listing_id', 'image_path');
            }])
            ->where('status', 'available')
            ->get();

        return response()->json($listings);
    }

    private function resolveEffectiveListingImageMaxBytes(): int
    {
        $validationLimitBytes = RealEstateListingRequest::MAX_IMAGE_SIZE_KB * 1024;
        $uploadMaxBytes = $this->iniSizeToBytes((string) ini_get('upload_max_filesize'));
        $postMaxBytes = $this->iniSizeToBytes((string) ini_get('post_max_size'));

        $candidates = array_filter(
            [$validationLimitBytes, $uploadMaxBytes, $postMaxBytes],
            static fn (int $value): bool => $value > 0
        );

        if ($candidates === []) {
            return $validationLimitBytes;
        }

        return (int) min($candidates);
    }

    private function iniSizeToBytes(string $size): int
    {
        $value = trim($size);
        if ($value === '') {
            return 0;
        }

        $unit = strtolower(substr($value, -1));
        $number = (float) $value;

        return match ($unit) {
            'g' => (int) ($number * 1024 * 1024 * 1024),
            'm' => (int) ($number * 1024 * 1024),
            'k' => (int) ($number * 1024),
            default => (int) $number,
        };
    }

}
