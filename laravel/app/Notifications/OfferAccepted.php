<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\RealEstateListing;

class OfferAccepted extends Notification
{
    public RealEstateListing $listing;

    public function __construct(RealEstateListing $listing)
    {
        $this->listing = $listing;
    }

    public function via($notifiable): array {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage {
        return (new MailMessage)
            ->greeting("Congratulations {$notifiable->name}!")
            ->line("🎉 Your offer for \"{$this->listing->title}\" has been accepted.")
            ->line("Our team has created a deal and the process has started.")
            ->action('View Your Deal', url("/deals")) // or direct to specific deal if available
            ->line('Thank you for using our platform!');
    }
}
