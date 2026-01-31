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
use Illuminate\Http\Request;
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

    public function index(): Response
    {

        $user_role = auth()->user()->role;

        $all_appointments = $this->service->getAllAppointments();
        $today_appointments = $this->service->getTodayAppointments();
        $upcoming_appointments = $this->service->getUpcomingAppointments();
        $past_appointments = $this->service->getPastAppointments();
        $accepted_appointments = $this->service->getAcceptedAppointments();
        $pending_appointments = $this->service->getPendingAppointments();
        $canseled_appointments = $this->service->getCanceledAppointments();

        if($user_role === 'buyer '){
            $rejected_appointments = $this->service->getRejectedAppointments();
        }

        $data = [
            'all_appointments' => $all_appointments,
            'today_appointments' => $today_appointments,
            'upcoming_appointments' => $upcoming_appointments,
            'past_appointments' => $past_appointments,
            'accepted_appointments' => $accepted_appointments,
            'pending_appointments' => $pending_appointments,
            'canceled_appointments' => $canseled_appointments,
        ];
        if ($user_role === 'buyer') {
            $data['rejected_appointments'] = $this->service->getRejectedAppointments();
        }

        if($user_role === 'buyer '){
            return inertia('Users/Buyer/Appointments/Index', $data);
        }

        return inertia('Users/Seller/Appointments/Index', $data);

    }

    public function buyerCancel(Request $request): JsonResponse {

        $appointment = resolve(Appointment::class)->findOrFail($request->appointment_id);
        $this->service->buyerCancel($appointment);

        return JsonResponder::send(
            new SuccessResponse(__('notifications.appointments.cancelled_by_buyer.success'))
        );
    }
}
