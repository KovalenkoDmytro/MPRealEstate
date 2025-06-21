<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\MailBuilders\PossessionDaySetMailBuilder;
use App\Models\Deal;

class PossessionDaySet extends Notification
{
    protected PossessionDaySetMailBuilder $builder;

    public function __construct(Deal $deal)
    {
        $this->builder = new PossessionDaySetMailBuilder($deal);
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
