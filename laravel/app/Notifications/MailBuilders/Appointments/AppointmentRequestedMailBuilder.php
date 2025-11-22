<?php

namespace App\Notifications\MailBuilders\Appointments;

use App\Models\Appointment;
use App\Notifications\Contracts\MailableContentBuilderInterface;
use Illuminate\Notifications\Messages\MailMessage;

class AppointmentRequestedMailBuilder implements MailableContentBuilderInterface
{
    protected Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('notifications.appointments.request.title'))
            ->greeting(__('mainBuilders.default.greeting', [
                'name' => $notifiable->name
            ]))
            ->line(__('notifications.appointments.request.body', [
                'listing' => $this->appointment->real_estate_listing_id
            ]));
    }
}
