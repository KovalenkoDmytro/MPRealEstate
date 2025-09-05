<?php

namespace App\Notifications;

use App\Notifications\MailBuilders\OfferSubmittedMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

class OfferSubmitted extends Notification implements ShouldQueue
{
    use Queueable;
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
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage {
          return (new OfferSubmittedMailBuilder($this->listing, $this->buyer, $this->offer))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type'  => __('notifications.offerSubmitted.type'),
            'title' => __('notifications.offerSubmitted.title'),
            'body'  => __('notifications.offerSubmitted.body', [
                'listing' => $this->listing->title,
            ]),
            'url'   => route('seller.listings.show', $this->listing),
        ];
    }
}
