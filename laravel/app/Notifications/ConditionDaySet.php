<?php

namespace App\Notifications;

use App\Notifications\MailBuilders\ConditionDaySetMailBuilder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use Illuminate\Contracts\Queue\ShouldQueue;

class ConditionDaySet extends Notification implements ShouldQueue
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
        return app(ConditionDaySetMailBuilder::class, ['deal' => $this->deal])->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.conditionDaySet.type'),
            'title' => __('notifications.conditionDaySet.title'),
            'body'  => __('notifications.conditionDaySet.body', [
                'deal' => $this->deal->name
            ]),
            'url'   => route('deals.show', $this->deal),
        ];
    }
}
