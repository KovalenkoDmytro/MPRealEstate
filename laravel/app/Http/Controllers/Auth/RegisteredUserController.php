<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Services\Auth\RegistrationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegisterUserRequest $request, RegistrationService $registrationService): RedirectResponse | JsonResponse {

        try {
            $registrationService->registerUser($request->validated());
            return redirect()->route('verification.notice')->with('message', 'Registration successful! Please check your email for verification.');

        } catch (\Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage());

            return response()->json(['message' => 'Registration failed. Please try again later.'], 500);
        }

    }
}
