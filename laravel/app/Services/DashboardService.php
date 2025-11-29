<?php

namespace App\Services;

use App\Models\Deal;
use App\Models\RealEstateListing;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardService
{
    protected OfferService $offerService;

    protected LawyerService $lawyerService;

    protected AppointmentService $appointmentService;

    protected RealEstateListingService $listingService;

    public function __construct(OfferService $offerService,
        LawyerService $lawyerService,
        AppointmentService $appointmentService,
        RealEstateListingService $listingService
    )
    {
        $this->offerService = $offerService;
        $this->lawyerService = $lawyerService;
        $this->appointmentService = $appointmentService;
        $this->listingService = $listingService;
    }

    /**
     * Return the appropriate dashboard response based on the user's role.
     */
    public function getDashboard(User $user): Response
    {

        return match (true) {
            $user->hasRole('buyer') => Inertia::render('Users/Buyer/Dashboard', [
                'offers' => $this->offerService->getBuyerOffers($user->id),
            ]),
            $user->hasRole('seller') => Inertia::render('Users/Seller/Dashboard', [
                'offers' => $this->offerService->getAllOffersForSeller($user->id),
                'appointments_stats' => $this->appointmentService->getSellerStatistics($user->id),
                'listingsPerformance_stats' => $this->listingService->getSellerListingPerformanceStats($user->id)
            ]),
            $user->hasRole('lawyer') => Inertia::render('Users/Lawyer/Dashboard', [
                'deals_detail' => $this->lawyerService->getDealsStatistics()
            ]),
            $user->hasRole('admin') => Inertia::render('Users/Admin/Dashboard', [
                'stats' => $this->getAdminStats(),
            ]),
        };
    }

    /**
     * Admin dashboard statistics.
     */
    private function getAdminStats(): array
    {
        return [
            'total_users' => User::count(),
            'total_listings' => RealEstateListing::count(),
            'total_deals' => Deal::count(),
        ];
    }
}
