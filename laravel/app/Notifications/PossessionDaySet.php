<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Deal;
use App\Notifications\MailBuilders\PossessionDaySetMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PossessionDaySet extends Notification implements ShouldQueue
{
    use Queueable;

    protected PossessionDaySetMailBuilder $builder;

    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
        $this->builder = new PossessionDaySetMailBuilder($deal);
        $this->onQueue('notifications');
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
            'type' => __('notifications.possessionDaySet.type'),
            'title' => __('notifications.possessionDaySet.title'),
            'body' => __('notifications.possessionDaySet.body', [
                'deal' => $this->deal->name,
            ]),
            'url' => route('deals.show', $this->deal),
        ];
    }
}
