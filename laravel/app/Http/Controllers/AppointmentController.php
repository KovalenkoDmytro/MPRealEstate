<?php

namespace App\Http\Controllers;

use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Helpers\Responses\ErrorResponse;
use App\Http\Requests\Appointments\AppointmentStoreRequest;
use App\Http\Requests\Appointments\AppointmentActionRequest;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Inertia\Response;

class AppointmentController extends Controller
{
    private AppointmentService $service;

    public function __construct(AppointmentService $service)
    {
        $this->service = $service;
    }

    public function store(AppointmentStoreRequest $request): JsonResponse {
        $this->service->create($request->validated());

        return JsonResponder::send(
            new SuccessResponse(__('notifications.appointments.request.success'))
        );
    }

    public function handle(AppointmentActionRequest $request): JsonResponse {

        $appointment = Appointment::with('buyer')
            ->where('id', $request->appointment_id)
            ->firstOrFail();

        if ($request->action === 'approve') {
            $this->service->approve($appointment, $request->access_code);

            return JsonResponder::send(
                new SuccessResponse(__('notifications.appointments.approved.success'))
            );
        }

        if ($request->action === 'reject') {
            $this->service->reject($appointment, $request->rejection_reason);

            return JsonResponder::send(
                new SuccessResponse(__('notifications.appointments.rejected.success'))
            );
        }

        return JsonResponder::send(new ErrorResponse(__('Invalid action.')), 400);
    }

    public function showAllSellerAppointments(): Response
    {
        $appointments = Appointment::where('seller_id', auth()->id())
            ->with(['buyer', 'listing'])
            ->orderBy('scheduled_at', 'desc')
            ->get();

        return inertia('Users/Seller/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    public function showAllBuyerAppointments(): Response
    {
        $appointments = Appointment::where('buyer_id', auth()->id())
            ->with(['seller', 'listing'])
            ->orderBy('scheduled_at', 'desc')
            ->get();

        return inertia('Users/Buyer/Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }
}
