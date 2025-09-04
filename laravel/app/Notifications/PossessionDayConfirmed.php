<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\MailBuilders\PossessionDayConfirmedMailBuilder;
use App\Models\Deal;
use Illuminate\Contracts\Queue\ShouldQueue;

class PossessionDayConfirmed extends Notification implements ShouldQueue
{
    protected PossessionDayConfirmedMailBuilder $builder;
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
        $this->builder = new PossessionDayConfirmedMailBuilder($deal);
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return $this->buildMailMessage($notifiable);
    }

    public function buildMailMessage($notifiable): MailMessage
    {
        return $this->builder->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.possessionDayConfirmed.type'),
            'title' => __('notifications.possessionDayConfirmed.title'),
            'body'  => __('notifications.possessionDayConfirmed.body', [
                'deal' => $this->deal->name,
            ]),
            'url'   => route('deals.show', $this->deal),
        ];
    }
}
