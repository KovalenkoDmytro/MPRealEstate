<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Deal;
use App\Notifications\MailBuilders\DepositMarkedAsMadeMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DepositMarkedAsMade extends Notification implements ShouldQueue
{
    use Queueable;

    public Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
        $this->onQueue('notifications');
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new DepositMarkedAsMadeMailBuilder($this->deal))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => __('notifications.depositMarkedAsMade.type'),
            'title' => __('notifications.depositMarkedAsMade.title'),
            'body' => __('notifications.depositMarkedAsMade.body', [
                'deal' => $this->deal->name,
            ]),
            'url' => route('deals.show', $this->deal),
        ];
    }
}
