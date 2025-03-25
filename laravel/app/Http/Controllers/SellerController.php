<?php
namespace App\Http\Controllers;


use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller {

    protected OfferController $offerController;
    protected DealController $dealController;

    public function __construct(OfferController $offerController, DealController $dealController) {
        $this->offerController = $offerController;
        $this->dealController = $dealController;
    }

    /**
     * ✅ Display Seller Dashboard with their Offers
     */
     public function index(): Response {
        $user = auth()->user();

        return Inertia::render('Users/Seller/Dashboard', [
            'offers' => $this->offerController->showAllOffers($user->id),
        ]);
    }


    public function showAllDeals(): Response {

        return Inertia::render('Users/Seller/Deals/Index', [
            'deals' => $this->dealController->getAllDeals(),
        ]);

    }

}
