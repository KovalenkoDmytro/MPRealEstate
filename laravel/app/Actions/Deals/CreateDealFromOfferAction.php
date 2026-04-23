<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Models\Offer;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateDealFromOfferAction
{
    use AsAction;

    public function handle(Offer $offer): Deal
    {
        $listing = $offer->listing;

        $deal = Deal::query()->create([
            'name' => 'Deal for '.$listing->title,
            'amount' => $offer->amount,
            'deal_message' => $offer->message,
            'real_estate_listing_id' => $listing->getKey(),
        ]);

        $deal->users()->attach([$offer->buyer_id, $listing->seller_id]);
        $listing->update(['status' => 'pending']);

        return $deal;
    }
}
