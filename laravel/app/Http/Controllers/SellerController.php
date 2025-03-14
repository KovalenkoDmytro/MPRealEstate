<?php
namespace App\Http\Controllers;


use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller {

    protected OfferController $offerController;

    public function __construct(OfferController $offerController) {
        $this->offerController = $offerController;
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

}
