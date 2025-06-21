<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\MailBuilders\PossessionDayConfirmedMailBuilder;
use App\Models\Deal;

class PossessionDayConfirmed extends Notification
{
    protected PossessionDayConfirmedMailBuilder $builder;

    public function __construct(Deal $deal)
    {
        $this->builder = new PossessionDayConfirmedMailBuilder($deal);
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return $this->buildMailMessage($notifiable);
    }

    public function buildMailMessage($notifiable): MailMessage
    {
        return $this->builder->build($notifiable);
    }
}
