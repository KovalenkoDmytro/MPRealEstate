<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LawyerController extends Controller
{
    /**
     * ✅ Display Lawyer Dashboard
     */
    public function index(): Response
    {

        return Inertia::render('Users/Lawyer/Dashboard');
    }
}
