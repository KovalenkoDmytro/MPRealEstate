<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use App\Notifications\MailBuilders\DepositMarkedAsMadeMailBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;

class DepositMarkedAsMade extends Notification implements ShouldQueue
{
    public Deal $deal;

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
        return (new DepositMarkedAsMadeMailBuilder($this->deal))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'     => 'deposit_marked_as_made',
            'title'    => '--Deposit Marked as Made',
           'body'     => "--Deposit for Deal #{$this->deal->name} was marked as made.",
            'url'      => route('deals.show', $this->deal), // adjust if your route differs
        ];
    }
}
