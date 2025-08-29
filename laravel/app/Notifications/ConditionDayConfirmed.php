<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use App\Notifications\MailBuilders\ConditionDayConfirmedMailBuilder;

class ConditionDayConfirmed extends Notification
{
    public Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage {
        return (new ConditionDayConfirmedMailBuilder($this->deal))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {

        return [
            'type'     => 'condition_day_confirmed',
            'title'    => 'Condition Day Confirmed--',
            'body' => "---Confirmed Condition Day View Deal #{$this->deal->name}",
            'url'      => route('deals.show', $this->deal),
        ];
    }
}
