<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Offer;
use App\Models\RealEstateListing;

class OfferConfirmation extends Notification
{
    public $listing;
    public $offer;

    public function __construct(RealEstateListing $listing, Offer $offer)
    {
        $this->listing = $listing;
        $this->offer = $offer;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->greeting("Hi {$notifiable->name},")
            ->line("Thank you for submitting an offer on \"{$this->listing->title}\".")
            ->line("💰 Offered Price: \${$this->offer->offer_price}")
            ->line("📍 Listing Location: {$this->listing->location}")
            ->action('View Your Offer', url("/listings/{$this->listing->id}"))
            ->line("We’ve notified the seller and they’ll respond soon.");
    }
}
