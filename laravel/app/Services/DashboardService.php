<?php

namespace App\Services;

use App\Models\Deal;
use App\Models\RealEstateListing;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardService {

    protected OfferService $offerService;

    protected LawyerService $lawyerService;

    protected AppointmentService $appointmentService;

    protected RealEstateListingService $listingService;

    protected DealService $dealService;

    protected FavoriteListingService $favoriteListingService;

    public function __construct(
        OfferService $offerService,
        LawyerService $lawyerService,
        AppointmentService $appointmentService,
        RealEstateListingService $listingService,
        DealService $dealService,
        FavoriteListingService $favoriteListingService
    ) {
        $this->offerService = $offerService;
        $this->lawyerService = $lawyerService;
        $this->appointmentService = $appointmentService;
        $this->listingService = $listingService;
        $this->dealService = $dealService;
        $this->favoriteListingService = $favoriteListingService;
    }

    /**
     * Return the appropriate dashboard response based on the user's role.
     */
    public function getDashboard(User $user): Response {
        return match (true) {
            $user->hasRole('buyer') => Inertia::render('Users/Buyer/Dashboard', [
                'offers' => $this->offerService->getBuyerOffers($user->id),
                'offers_stats'       => $this->offerService->getUserOfferStats($user),
                'appointments_stats' => $this->appointmentService->getBayerStatistics($user),
                'favorite_listings'  => $this->favoriteListingService->getFavorites($user),
            ]),
            $user->hasRole('seller') => Inertia::render('Users/Seller/Dashboard', [
                'offers_stats'              => $this->offerService->getUserOfferStats($user),
                'appointments_stats'        => $this->appointmentService->getSellerStatistics($user->id),
                'listingsPerformance_stats' => $this->listingService->getSellerListingPerformanceStats($user->id),
                'deals_stats'               => $this->dealService->getUserDealStats($user),
            ]),
            $user->hasRole('lawyer') => Inertia::render('Users/Lawyer/Dashboard', [
                'deals_detail' => $this->lawyerService->getDealsStatistics(),
            ]),
            $user->hasRole('admin') => Inertia::render('Users/Admin/Dashboard', [
                'stats' => $this->getAdminStats(),
            ]),
        };
    }

    /**
     * Admin dashboard statistics.
     */
    private function getAdminStats(): array {
        return [
            'total_users'    => User::count(),
            'total_listings' => RealEstateListing::count(),
            'total_deals'    => Deal::count(),
        ];
    }

}
