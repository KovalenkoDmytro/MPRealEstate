<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\RealEstateListing;
use App\Notifications\Appointments\AppointmentAcceptedNotification;
use App\Notifications\Appointments\AppointmentCancelledByBuyerNotification;
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

    public function buyerCancel(Appointment $appointment): void
    {

        // Make sure buyer owns this appointment
        if (auth()->id() !== $appointment->buyer_id) {
            abort(403, __('global.errors.unauthorized'));
        }

        // Prevent canceling already finished appointments
        if (in_array($appointment->status, ['rejected', 'cancelled by buyer'])) {
            return;
        }

        $appointment->update([
            'buyer_cancelled_at' => now(),
            'status'             => 'cancelled by buyer',
        ]);

        // Load seller relation
        $appointment->load('seller');

        // Notify seller
        $appointment->seller->notify(
            new AppointmentCancelledByBuyerNotification($appointment)
        );
    }
}
