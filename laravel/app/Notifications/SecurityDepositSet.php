<?php

namespace App\Notifications;

use App\Notifications\MailBuilders\SecurityDepositSetMailBuilder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;


class SecurityDepositSet extends Notification
{
    protected SecurityDepositSetMailBuilder $builder;

    public function __construct(Deal $deal)
    {
        $this->builder = new SecurityDepositSetMailBuilder($deal);
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return $this->builder->build($notifiable);
    }
}
