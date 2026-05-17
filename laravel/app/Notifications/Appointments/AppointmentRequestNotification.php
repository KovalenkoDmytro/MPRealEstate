<?php

namespace App\Notifications\Appointments;

use App\Models\Appointment;
use App\Notifications\MailBuilders\Appointments\AppointmentRequestedMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class AppointmentRequestNotification extends Notification implements ShouldQueue
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
        return app(AppointmentRequestedMailBuilder::class, [
            'appointment' => $this->appointment
        ])->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.appointments.request.type'),
            'title' => __('notifications.appointments.request.title'),
            'body'  => __('notifications.appointments.request.body', [
                'listing' => $this->appointment->real_estate_listing_id,
            ]),
            'url'   => route('appointments.index'),
        ];
    }
}
