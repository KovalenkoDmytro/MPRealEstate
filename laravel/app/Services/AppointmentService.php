<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\RealEstateListing;
use App\Notifications\Appointments\AppointmentAcceptedNotification;
use App\Notifications\Appointments\AppointmentRejectedNotification;
use App\Notifications\Appointments\AppointmentRequestNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AppointmentService
{
    /**
     * Buyer creates an appointment
     */
    public function create(array $data): Appointment
    {
        $listing = RealEstateListing::findOrFail($data['listing_id']);
        $seller  = $listing->seller;

        $appointment = Appointment::create([
            'buyer_id'               => Auth::id(),
            'seller_id'              => $seller->id,
            'real_estate_listing_id' => $listing->id,
            'scheduled_at'           => Carbon::parse($data['scheduled_at']),
            'status'                 => 'pending',
        ]);

        // Notify seller
        $seller->notify(new AppointmentRequestNotification($appointment));

        return $appointment;
    }

    /**
     * Seller approves appointment
     */
    public function approve(Appointment $appointment, string|null $accessCode): void
    {
        $appointment->update([
            'status'       => 'accepted',
            'access_code' => $accessCode,
        ]);

        $appointment->buyer->notify(new AppointmentAcceptedNotification($appointment));
    }

    /**
     * Seller rejects appointment
     */
    public function reject(Appointment $appointment, string $reason): void
    {

        $appointment->update([
            'status'            => 'rejected',
            'rejection_reason'  => $reason,
        ]);

        $appointment->buyer->notify(new AppointmentRejectedNotification($appointment));
    }
}
