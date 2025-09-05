<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use App\Notifications\MailBuilders\DepositConfirmedMailBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;

class DepositConfirmed extends Notification implements ShouldQueue
{
    use Queueable;
    public Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array
    {
        return ['mail' ,'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new DepositConfirmedMailBuilder($this->deal))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.depositConfirmed.type'),
            'title' => __('notifications.depositConfirmed.title'),
            'body'  => __('notifications.depositConfirmed.body', [
                'deal' => $this->deal->name,
            ]),
            'url'   => route('deals.show', $this->deal),
        ];
    }
}
