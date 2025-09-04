<?php

namespace App\Notifications\MailBuilders;

use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Contracts\MailableContentBuilderInterface;

class OfferSubmittedMailBuilder implements MailableContentBuilderInterface
{
    protected RealEstateListing $listing;
    protected User $buyer;
    protected Offer $offer;

    public function __construct(RealEstateListing $listing, User $buyer, Offer $offer)
    {
        $this->listing = $listing;
        $this->buyer = $buyer;
        $this->offer = $offer;
    }

    public function build($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('mainBuilders.offerSubmitted.subject'))
            ->greeting(__('mainBuilders.offerSubmitted.greeting', [
                'name' => $notifiable->name,
            ]))
            ->line(__('mainBuilders.offerSubmitted.lines.0', [
                'listingTitle' => $this->listing->title,
            ]))
            ->line(__('mainBuilders.offerSubmitted.lines.1', [
                'buyerName'  => $this->buyer->name,
                'buyerEmail' => $this->buyer->email,
            ]))
            ->line(__('mainBuilders.offerSubmitted.lines.2', [
                'offerPrice' => number_format($this->offer->offer_price, 2),
            ]))
            ->line(__('mainBuilders.offerSubmitted.lines.3', [
                'message' => $this->offer->message ?: __('(no message)'),
            ]))
            ->action(
                __('mainBuilders.offerSubmitted.action.label'),
                url(str_replace(':offerId', $this->offer->id, __('mainBuilders.offerSubmitted.action.url')))
            )
            ->line(__('mainBuilders.offerSubmitted.lines.4'));
    }
}
