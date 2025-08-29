<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\RealEstateListing;
use App\Notifications\MailBuilders\OfferStatusUpdatedMailBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;

class OfferStatusUpdated extends Notification implements ShouldQueue
{
    public RealEstateListing $listing;
    public string $status;

    public function __construct(RealEstateListing $listing, string $status)
    {
        $this->listing = $listing;
        $this->status = $status;
    }

    public function via($notifiable): array
    {
        return ['mail','database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new OfferStatusUpdatedMailBuilder($this->listing, $this->status))->build($notifiable);
    }

    public function toDatabase($notifiable): array
    {

        if ($this->status === 'accepted') {
            $body = "🎉 Your offer for {$this->listing->title} has been accepted.";
        } else{
            $body = "Unfortunately, your offer for {$this->listing->title} has been rejected.";
        }

        return [
            'type'  => 'offer_status_updated',
            'title' => 'Offer Status Updated',
            'body'  => $body,
            'url'   => route('buyer.listings.show', $this->listing),
        ];
    }
}
