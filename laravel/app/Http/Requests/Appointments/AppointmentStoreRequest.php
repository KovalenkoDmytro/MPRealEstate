<?php

namespace App\Http\Requests\Appointments;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        return $user?->hasRole('buyer') ?? false;
    }

    public function rules(): array
    {
        return [
            'listing_id'   => 'required|exists:real_estate_listings,id',
            'scheduled_at' => 'required|date|after:now',
        ];
    }
}
