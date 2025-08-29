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
            'type'     => 'deal_break_requested_rejected',
            'title'    => '---Deal Break Rejected',
            'body'     => "---Your deal-break request for Deal #{$this->deal->name} was rejected.",
            'url'      => route('deals.show', $this->deal), // adjust to your route
        ];
    }

}
