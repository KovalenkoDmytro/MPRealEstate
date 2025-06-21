<?php

namespace App\Notifications\MailBuilders;

use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Contracts\MailableContentBuilderInterface;

class OfferSubmittedMailBuilder implements MailableContentBuilderInterface
{
    protected RealEstateListing $listing;
    protected User $buyer;
    protected Offer $offer;

    public function __construct(RealEstateListing $listing, User $buyer, Offer $offer)
    {
        $this->listing = $listing;
        $this->buyer = $buyer;
        $this->offer = $offer;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting("Hi {$notifiable->name},")
            ->line("You’ve received a new offer on your listing: \"{$this->listing->title}\".")
            ->line("👤 Buyer: {$this->buyer->name} ({$this->buyer->email})")
            ->line("💰 Offered Price: \${$this->offer->offer_price}")
            ->line("📩 Message: {$this->offer->message}")
            ->action('View Offer Details', url("/dashboard/offers/{$this->offer->id}"))
            ->line("Please review and respond to the offer.");
    }
}
