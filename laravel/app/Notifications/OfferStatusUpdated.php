<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\RealEstateListing;
use App\Notifications\MailBuilders\OfferStatusUpdatedMailBuilder;

class OfferStatusUpdated extends Notification
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
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new OfferStatusUpdatedMailBuilder($this->listing, $this->status))->build($notifiable);
    }
}
