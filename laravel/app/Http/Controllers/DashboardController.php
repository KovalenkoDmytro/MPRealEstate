<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\HttpException;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();

        return match (true) {
            $user->hasRole('buyer')  => app(BuyerController::class)->index(),
            $user->hasRole('seller') => app(SellerController::class)->index(),
            $user->hasRole('lawyer') => app(LawyerController::class)->index(),
            default => throw new HttpException(403, 'Unauthorized'),
        };
    }
}
