<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\Responses\ErrorResponse;
use App\Helpers\Responses\JsonResponder;
use App\Helpers\Responses\SuccessResponse;
use App\Http\Requests\Appointments\AppointmentActionRequest;
use App\Http\Requests\Appointments\AppointmentStoreRequest;
use App\Models\Appointment;
use App\Services\AppointmentService;
use App\Support\RoleViewResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class AppointmentController extends Controller
{
    private AppointmentService $service;

    public function __construct(AppointmentService $service)
    {
        $this->service = $service;
    }

    public function store(AppointmentStoreRequest $request): JsonResponse
    {
        $this->service->create($request->validated(), $request->user());

        return JsonResponder::send(
            new SuccessResponse(__('notifications.appointments.request.success'))
        );
    }

    public function handle(AppointmentActionRequest $request): JsonResponse
    {
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

    public function index(): Response
    {
        $user = auth()->user();
        $user_role = $user->role;

        $data = [
            'all_appointments'      => $this->service->getAllAppointments($user),
            'today_appointments'    => $this->service->getTodayAppointments($user),
            'upcoming_appointments' => $this->service->getUpcomingAppointments($user),
            'past_appointments'     => $this->service->getPastAppointments($user),
            'accepted_appointments' => $this->service->getAcceptedAppointments($user),
            'pending_appointments'  => $this->service->getPendingAppointments($user),
            'canceled_appointments' => $this->service->getCanceledAppointments($user),
        ];

        if ($user_role === 'buyer') {
            $data['rejected_appointments'] = $this->service->getRejectedAppointments($user);
        }

        return inertia(RoleViewResolver::resolve([
            'buyer'  => 'Users/Buyer/Appointments/Index',
            'seller' => 'Users/Seller/Appointments/Index',
        ]), $data);
    }

    public function buyerCancel(Request $request): JsonResponse
    {
        $appointment = resolve(Appointment::class)->findOrFail($request->appointment_id);
        $this->service->buyerCancel($appointment, auth()->user());

        return JsonResponder::send(
            new SuccessResponse(__('notifications.appointments.cancelled_by_buyer.success'))
        );
    }
}
