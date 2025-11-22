<?php

namespace App\Http\Requests\Appointments;

use App\Models\Appointment;
use Illuminate\Foundation\Http\FormRequest;

class AppointmentActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $appointmentId = $this->input('appointment_id');

        if (!$appointmentId) {
            return false;
        }

        $appointment = Appointment::find($appointmentId);

        return auth()->check()
            && $appointment
            && auth()->id() === $appointment->seller_id;
    }

    public function rules(): array
    {
        return [
            'appointment_id'   => 'required|exists:appointments,id',
            'action'           => 'required|in:approve,reject',
            'access_code'     => 'required_if:action,approve|string|max:255',
            'rejection_reason' => 'required_if:action,reject|string|min:10|max:500',
        ];
    }
}
