<?php

namespace App\Notifications;

use App\Models\Deal;
use App\Notifications\MailBuilders\DealBreakRequestedApprovedMailBuilder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;


class DealBreakRequestedApproved extends Notification
{

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
            'type'     => 'deal_break_requested_approved',
            'title'    => '---Deal Break Approved',
           'body'     => "---Your deal-break request for Deal #{$this->deal->name} was approved.",
            'url'      => route('deals.show', $this->deal), // adjust if route differs

        ];
    }

}
