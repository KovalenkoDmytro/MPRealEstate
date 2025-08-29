<?php

namespace App\Notifications;

use App\Notifications\MailBuilders\SecurityDepositSetMailBuilder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;
use Illuminate\Contracts\Queue\ShouldQueue;


class SecurityDepositSet extends Notification implements ShouldQueue
{
    protected Deal $deal;
    protected SecurityDepositSetMailBuilder $builder;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
        $this->builder = new SecurityDepositSetMailBuilder($deal);
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return $this->builder->build($notifiable);
    }
    public function toDatabase($notifiable): array
    {
        return [
            'type'     => 'security_deposit_set',
            'title'    => '--Security Deposit Set',
            'body'     => "--Security deposit was set for Deal #{$this->deal->name}.",
            'url'      => route('deals.show', $this->deal),
        ];
    }
}
