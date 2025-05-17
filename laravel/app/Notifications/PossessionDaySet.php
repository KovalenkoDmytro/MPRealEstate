<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;

class PossessionDaySet extends Notification
{
    public Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage {
        return (new MailMessage)
            ->greeting("Hello {$notifiable->name},")
            ->line("The buyer has set the possession day for your deal on \"{$this->deal->listing->title}\".")
            ->line("📅 Possession Day: {$this->deal->possession_day->format('F j, Y')}")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line("Please review and confirm when ready.");
    }
}
