<?php

namespace App\Notifications;

use App\Models\Deal;
use App\Notifications\MailBuilders\DealBreakRequestedRejectedMailBuilder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;


class DealBreakRequestedRejected extends Notification implements ShouldQueue
{

    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array
    {
        return ['mail',];
    }


    public function toMail($notifiable): MailMessage
    {
        return app(DealBreakRequestedRejectedMailBuilder::class, ['deal' => $this->deal])->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.dealBreakRequestedRejected.type'),
            'title' => __('notifications.dealBreakRequestedRejected.title'),
            'body'  => __('notifications.dealBreakRequestedRejected.body', [
                'deal' => $this->deal->name,
            ]),
            'url'   => route('deals.show', $this->deal),
        ];
    }

}
