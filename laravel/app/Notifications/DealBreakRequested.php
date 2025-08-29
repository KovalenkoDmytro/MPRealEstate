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
            'type'     => 'deal_break_requested',
            'title'    => '--Deal Break Requested',
            'body'     => "---Deal #{$this->deal->name} requires your review.",
            'url'      => route('deals.show', $this->deal), // adjust if your route name differs
        ];
    }

}
