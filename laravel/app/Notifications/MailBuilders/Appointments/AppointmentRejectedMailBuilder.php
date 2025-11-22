<?php

namespace App\Notifications\MailBuilders\Appointments;

use App\Models\Appointment;
use App\Notifications\Contracts\MailableContentBuilderInterface;
use Illuminate\Notifications\Messages\MailMessage;

class AppointmentRejectedMailBuilder implements MailableContentBuilderInterface
{
    protected Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('notifications.appointments.rejected.title'))
            ->greeting(__('mainBuilders.default.greeting', [
                'name' => $notifiable->name
            ]))
            ->line(__('notifications.appointments.rejected.body', [
                'listing' => $this->appointment->real_estate_listing_id
            ]))
            ->line(__('notifications.appointments.rejected.reason_title'))
            ->line(__('notifications.appointments.rejected.reason_body', [
                'reason' => $this->appointment->rejection_reason ?? __('mainBuilders.default.no_reason_provided')
            ]));
    }
}
