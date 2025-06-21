<?php

namespace App\Notifications\MailBuilders;

use App\Models\Offer;
use App\Models\RealEstateListing;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Contracts\MailableContentBuilderInterface;

class OfferConfirmationMailBuilder implements MailableContentBuilderInterface
{
    protected RealEstateListing $listing;
    protected Offer $offer;

    public function __construct(RealEstateListing $listing, Offer $offer)
    {
        $this->listing = $listing;
        $this->offer = $offer;
    }

    public function build($notifiable): MailMessage
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
