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
            ->subject(__('mainBuilders.offerConfirmation.subject'))
            ->greeting(__('mainBuilders.offerConfirmation.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.offerConfirmation.lines.0', [
                'listingTitle' => $this->listing->title,
            ]))
            ->line(__('mainBuilders.offerConfirmation.lines.1', [
                'offerPrice' => number_format($this->offer->offer_price, 2),
            ]))
            ->line(__('mainBuilders.offerConfirmation.lines.2', [
                'listingLocation' => $this->listing->location,
            ]))
            ->action(
                __('mainBuilders.offerConfirmation.action.label'),
                url(str_replace(':listingId', $this->listing->id, __('mainBuilders.offerConfirmation.action.url')))
            )
            ->line(__('mainBuilders.offerConfirmation.lines.3'));
    }

}
