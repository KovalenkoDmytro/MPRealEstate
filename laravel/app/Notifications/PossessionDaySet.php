<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\MailBuilders\PossessionDaySetMailBuilder;
use App\Models\Deal;

class PossessionDaySet extends Notification
{
    protected PossessionDaySetMailBuilder $builder;
    protected Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
        $this->builder = new PossessionDaySetMailBuilder($deal);
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
            'type'     => 'possession_day_set',
            'title'    => '--Possession Day Set',
            'body'     => "--Possession day was set for Deal # {$this->deal->name}",
            'url'      => route('deals.show', $this->deal), // adjust if your route differs

        ];
    }
}
