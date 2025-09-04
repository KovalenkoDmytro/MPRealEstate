<?php

namespace App\Notifications;

use App\Models\Deal;
use App\Notifications\MailBuilders\DealBreakRequestedMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;


class DealBreakRequested extends Notification implements ShouldQueue
{
    use Queueable;

    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }


    public function toMail($notifiable): MailMessage
    {
        return app(DealBreakRequestedMailBuilder::class, ['deal' => $this->deal, 'notifiable' => $notifiable,])->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.dealBreakRequested.type'),
            'title' => __('notifications.dealBreakRequested.title'),
            'body'  => __('notifications.dealBreakRequested.body', [
                'deal' => $this->deal->name,
            ]),
            'url'   => route('deals.show', $this->deal),
        ];
    }

}
