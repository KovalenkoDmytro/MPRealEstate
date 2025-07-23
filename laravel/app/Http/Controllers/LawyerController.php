<?php

namespace App\Http\Controllers;

use App\Services\LawyerService;
use Inertia\Inertia;
use Inertia\Response;

class LawyerController extends Controller
{
    private LawyerService $lawyerService;

    public function __construct(LawyerService $lawyerService)
    {
        $this->lawyerService = $lawyerService;
    }

    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $deals = $this->lawyerService->getAllDealsForLawyer($user);

        return Inertia::render('Users/Lawyer/Dashboard', [
            'deals' => $deals,
        ]);
    }

}
