<?php

namespace App\Notifications\MailBuilders;

use App\Models\RealEstateListing;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Contracts\MailableContentBuilderInterface;

class OfferStatusUpdatedMailBuilder implements MailableContentBuilderInterface
{
    protected RealEstateListing $listing;
    protected string $status;

    public function __construct(RealEstateListing $listing, string $status)
    {
        $this->listing = $listing;
        $this->status = $status;
    }

    public function build($notifiable): MailMessage
    {
        if ($this->status === 'accepted') {
            return (new MailMessage)
                ->greeting(__('mainBuilders.offerStatusUpdated.accepted.greeting', [
                    'name' => $notifiable->name,
                ]))
                ->line(__('mainBuilders.offerStatusUpdated.accepted.lines.0', [
                    'listingTitle' => $this->listing->title,
                ]))
                ->line(__('mainBuilders.offerStatusUpdated.accepted.lines.1'))
                ->action(
                    __('mainBuilders.offerStatusUpdated.accepted.action.label'),
                    url(__('mainBuilders.offerStatusUpdated.accepted.action.url'))
                )
                ->line(__('mainBuilders.offerStatusUpdated.accepted.lines.2'));
        }

        if ($this->status === 'rejected') {
            return (new MailMessage)
                ->greeting(__('mainBuilders.offerStatusUpdated.rejected.greeting', [
                    'name' => $notifiable->name,
                ]))
                ->line(__('mainBuilders.offerStatusUpdated.rejected.lines.0', [
                    'listingTitle' => $this->listing->title,
                ]))
                ->line(__('mainBuilders.offerStatusUpdated.rejected.lines.1'))
                ->action(
                    __('mainBuilders.offerStatusUpdated.rejected.action.label'),
                    url(__('mainBuilders.offerStatusUpdated.rejected.action.url'))
                )
                ->line(__('mainBuilders.offerStatusUpdated.rejected.lines.2'));
        }

        return (new MailMessage)
            ->greeting(__('mainBuilders.offerStatusUpdated.updated.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.offerStatusUpdated.updated.lines.0', [
                'listingTitle' => $this->listing->title,
            ]));
    }
}
