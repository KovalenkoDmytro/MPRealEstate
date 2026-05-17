<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\RealEstateListing;
use App\Notifications\MailBuilders\OfferStatusUpdatedMailBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;

class OfferStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;
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
        $body = $this->status === 'accepted'
            ? __('notifications.offerStatusUpdated.accepted', ['listing' => $this->listing->title])
            : __('notifications.offerStatusUpdated.rejected', ['listing' => $this->listing->title]);

        return [
            'type'  => __('notifications.offerStatusUpdated.type'),
            'title' => __('notifications.offerStatusUpdated.title'),
            'body'  => $body,
            'url'   => route('listings.show', $this->listing),
        ];
    }
}
