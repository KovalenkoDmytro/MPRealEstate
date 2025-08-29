<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use App\Notifications\MailBuilders\DepositConfirmedMailBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;

class DepositConfirmed extends Notification implements ShouldQueue
{
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
            'type'     => 'deposit_confirmed',
            'title'    => '--Deposit Confirmed',
            'body'     => "--Deposit for Deal #{$this->deal->name} has been confirmed.",
           'url'      => route('deals.show', $this->deal), // adjust if your route differs

        ];
    }
}
