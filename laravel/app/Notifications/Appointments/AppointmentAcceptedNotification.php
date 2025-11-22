<?php

namespace App\Notifications\Appointments;

use App\Models\Appointment;
use App\Notifications\MailBuilders\Appointments\AppointmentAcceptedMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class AppointmentAcceptedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return app(AppointmentAcceptedMailBuilder::class, [
            'appointment' => $this->appointment
        ])->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.appointments.accepted.type'),
            'title' => __('notifications.appointments.accepted.title'),
            'body'  => __('notifications.appointments.accepted.body', [
                'listing' => $this->appointment->real_estate_listing_id,
                'access_code' => $this->appointment->access_code
            ]),
        ];
    }
}
