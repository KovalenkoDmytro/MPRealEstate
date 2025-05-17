<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;

class DepositMarkedAsMade extends Notification
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
            ->line("The buyer has marked their security deposit as made for the listing \"{$this->deal->listing->title}\".")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line("Please log in to verify and confirm receipt.");
    }
}
