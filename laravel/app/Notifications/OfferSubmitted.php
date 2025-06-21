<?php

namespace App\Notifications;

use App\Notifications\MailBuilders\OfferSubmittedMailBuilder;
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
          return (new OfferSubmittedMailBuilder($this->listing, $this->buyer, $this->offer))->build($notifiable);
    }
}
