<?php

namespace App\Notifications;

use App\Notifications\MailBuilders\ConditionDaySetMailBuilder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;


class ConditionDaySet extends Notification
{
    public Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage {
        return app(ConditionDaySetMailBuilder::class, ['deal' => $this->deal])->build($notifiable);
    }
}
