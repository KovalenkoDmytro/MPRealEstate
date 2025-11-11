<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
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

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }


    public function store(RegisterUserRequest $request, RegistrationService $registrationService): RedirectResponse | JsonResponse {

        try {
            $registrationService->registerUser($request->validated());

            return JsonResponder::send(
                new SuccessResponse(__('Registration successful! Please check your email for verification.'))
            );

        } catch (\Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage());

            return JsonResponder::send(
                new ErrorResponse($e->getMessage())
            );
        }

    }
}
