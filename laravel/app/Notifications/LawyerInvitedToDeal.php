<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Deal;

class LawyerInvitedToDeal extends Notification
{
    public Deal $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting("Hello {$notifiable->name},")
            ->line("You have been invited to participate in a real estate deal.")
            ->line("🏡 Property: {$this->deal->listing->title}")
            ->action('View Deal', url("/deals/{$this->deal->id}"))
            ->line('Please review the deal and take action where needed.');
    }
}
