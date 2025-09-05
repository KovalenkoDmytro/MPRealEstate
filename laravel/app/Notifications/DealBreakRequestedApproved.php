<?php

namespace App\Notifications;

use App\Models\Deal;
use App\Notifications\MailBuilders\DealBreakRequestedApprovedMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;


class DealBreakRequestedApproved extends Notification implements ShouldQueue
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
        return app(DealBreakRequestedApprovedMailBuilder::class, ['deal' => $this->deal])->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.dealBreakRequestedApproved.type'),
            'title' => __('notifications.dealBreakRequestedApproved.title'),
            'body'  => __('notifications.dealBreakRequestedApproved.body', [
                'deal' => $this->deal->name,
            ]),
            'url'   => route('deals.show', $this->deal),
        ];
    }

}
