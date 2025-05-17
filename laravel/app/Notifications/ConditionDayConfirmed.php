<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;

class ConditionDayConfirmed extends Notification
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
            ->line("The seller has confirmed the condition day for your deal on \"{$this->deal->listing->title}\".")
            ->line("📅 Confirmed Condition Day: {$this->deal->condition_day->format('F j, Y')}")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line("Thank you for continuing the transaction process.");
    }
}
