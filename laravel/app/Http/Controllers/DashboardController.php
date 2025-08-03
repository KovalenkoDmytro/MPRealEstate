<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __invoke(DashboardService $dashboardService)
    {
        return $dashboardService->getDashboard(Auth::user());
    }
}
