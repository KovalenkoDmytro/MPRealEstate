<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;

class OfferSubmitted extends Notification
{
    public RealEstateListing $listing;
    public User $buyer;
    public Offer $offer;

    public function __construct(RealEstateListing $listing, User $buyer, Offer $offer)
    {
        $this->listing = $listing;
        $this->buyer = $buyer;
        $this->offer = $offer;
    }

    public function via($notifiable): array {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage {
        return (new MailMessage)
            ->greeting("Hello {$notifiable->name},")
            ->line("You received a new offer on your listing \"{$this->listing->title}\".")
            ->line("💰 Offered Price: \${$this->offer->offer_price}")
            ->line("✉️ Message: {$this->offer->message}")
            ->action('View Listing', url("/listings/{$this->listing->id}"))
            ->line('Respond to the offer as soon as possible!');
    }
}
