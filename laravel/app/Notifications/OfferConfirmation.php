<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Notifications\MailBuilders\OfferConfirmationMailBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OfferConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    public RealEstateListing $listing;

    public Offer $offer;

    public function __construct(RealEstateListing $listing, Offer $offer)
    {
        $this->listing = $listing;
        $this->offer = $offer;
        $this->onQueue('notifications');
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new OfferConfirmationMailBuilder($this->listing, $this->offer))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => __('notifications.offerConfirmation.type'),
            'title' => __('notifications.offerConfirmation.title'),
            'body' => __('notifications.offerConfirmation.body', [
                'listing' => $this->listing->title,
            ]),
            'url' => route('listings.show', $this->listing),
        ];
    }
}
