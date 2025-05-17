<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\RealEstateListing;

class OfferStatusUpdated extends Notification
{
    public RealEstateListing $listing;
    public string $status;

    public function __construct(RealEstateListing $listing, string $status)
    {
        $this->listing = $listing;
        $this->status = $status;
    }

    public function via($notifiable): array {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage {
        $message = new MailMessage();

        if ($this->status === 'accepted') {
            return $message
                ->greeting("Congratulations {$notifiable->name}!")
                ->line("🎉 Your offer for \"{$this->listing->title}\" has been accepted.")
                ->line("Our team has created a deal and the process has started.")
                ->action('View Your Deal', url("/deals"))
                ->line("Thank you for using our platform!");
        }

        if ($this->status === 'rejected') {
            return $message
                ->greeting("Hello {$notifiable->name},")
                ->line("Unfortunately, your offer for \"{$this->listing->title}\" has been rejected.")
                ->line("We encourage you to explore other available listings.")
                ->action('Browse Listings', url("/listings"))
                ->line("Thank you for your interest.");
        }

        return $message
            ->line("Your offer status on \"{$this->listing->title}\" has been updated.");
    }
}
