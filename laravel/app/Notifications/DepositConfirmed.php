<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;

class DepositConfirmed extends Notification
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
            ->line("Your deposit for the deal on \"{$this->deal->listing->title}\" has been confirmed by the seller.")
            ->action('View Deal Details', url("/deals/{$this->deal->id}"))
            ->line("Next steps will follow shortly.");
    }
}
