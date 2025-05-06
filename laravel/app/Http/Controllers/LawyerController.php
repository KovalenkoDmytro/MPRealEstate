<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LawyerController extends Controller
{
    protected DealController $dealController;

    public function __construct(DealController $dealController) {
        $this->dealController = $dealController;
    }

    /**
     * ✅ Display Lawyer Dashboard
     */
    public function index(): Response
    {

        return Inertia::render('Users/Lawyer/Dashboard',
            [
            'deals' => $this->dealController->getAllDeals(),
        ]
        );
    }


}
