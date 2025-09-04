<?php

namespace App\Notifications;

use App\Notifications\MailBuilders\OfferConfirmationMailBuilder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Offer;
use App\Models\RealEstateListing;
use Illuminate\Contracts\Queue\ShouldQueue;

class OfferConfirmation extends Notification implements ShouldQueue
{
    public RealEstateListing $listing;
    public Offer $offer;

    public function __construct(RealEstateListing $listing, Offer $offer)
    {
        $this->listing = $listing;
        $this->offer = $offer;
    }

    public function via($notifiable): array {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage {
        return (new OfferConfirmationMailBuilder($this->listing, $this->offer))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.offerConfirmation.type'),
            'title' => __('notifications.offerConfirmation.title'),
            'body'  => __('notifications.offerConfirmation.body', [
                'listing' => $this->listing->title,
            ]),
            'url'   => route('buyer.listings.show', $this->listing),
        ];
    }
}
