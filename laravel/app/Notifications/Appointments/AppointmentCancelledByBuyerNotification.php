<?php

declare(strict_types=1);

namespace App\Notifications\Appointments;

use App\Models\Appointment;
use App\Notifications\MailBuilders\Appointments\AppointmentCancelledByBuyerMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentCancelledByBuyerNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
        $this->onQueue('notifications');
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return app(AppointmentCancelledByBuyerMailBuilder::class, [
            'appointment' => $this->appointment,
        ])->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => __('notifications.appointments.cancelled_by_buyer.type'),
            'title' => __('notifications.appointments.cancelled_by_buyer.title'),
            'body' => __('notifications.appointments.cancelled_by_buyer.body', [
                'listing' => $this->appointment->real_estate_listing_id,
            ]),
            'url' => route('appointments.index'),
        ];
    }
}
