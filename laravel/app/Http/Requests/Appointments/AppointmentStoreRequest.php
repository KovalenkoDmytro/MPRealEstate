<?php

declare(strict_types=1);

namespace App\Http\Requests\Appointments;

use App\Models\Appointment;
use Carbon\Carbon;
use Closure;
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
            'listing_id' => 'required|exists:real_estate_listings,id',
            'scheduled_at' => [
                'required',
                'date',
                'after:now',
                function (string $attribute, mixed $value, Closure $fail): void {
                    $scheduledAt = Carbon::parse($value)->utc();

                    if (! in_array($scheduledAt->minute, [0, 30], true)) {
                        $fail('Appointments can only be scheduled at :00 or :30 minutes.');

                        return;
                    }

                    $taken = Appointment::query()
                        ->where('real_estate_listing_id', $this->input('listing_id'))
                        ->whereIn('status', ['pending', 'accepted'])
                        ->where('scheduled_at', $scheduledAt)
                        ->exists();

                    if ($taken) {
                        $fail('This time slot is already booked. Please choose a different time.');
                    }
                },
            ],
        ];
    }
}
