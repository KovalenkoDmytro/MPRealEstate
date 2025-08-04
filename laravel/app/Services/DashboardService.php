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

    public function __construct(OfferService $offerService, LawyerService $lawyerService)
    {
        $this->offerService = $offerService;
        $this->lawyerService = $lawyerService;
    }

    /**
     * Return the appropriate dashboard response based on the user's role.
     */
    public function getDashboard(User $user): Response
    {
        return match (true) {
            $user->hasRole('buyer')  => Inertia::render('Users/Buyer/Dashboard', [
                'offers' => $this->offerService->getBuyerOffers($user->id),
            ]),
            $user->hasRole('seller') => Inertia::render('Users/Seller/Dashboard', [
                'offers' => $this->offerService->getAllOffersForSeller($user->id),
            ]),
            $user->hasRole('lawyer') => Inertia::render('Users/Lawyer/Dashboard', [
                'deals' => $this->lawyerService->getAllDealsForLawyer($user),
            ]),
            $user->hasRole('admin')  => Inertia::render('Users/Admin/Dashboard', [
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
