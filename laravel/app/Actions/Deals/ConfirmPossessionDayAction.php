<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Notifications\PossessionDayConfirmed;
use Lorisleiva\Actions\Concerns\AsAction;

class ConfirmPossessionDayAction
{
    use AsAction;

    public function handle(Deal $deal): void
    {
        $deal->is_possession_day_confirmed = true;
        $deal->possession_day_confirmed_at = now();
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();

        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new PossessionDayConfirmed($deal));
        }
    }
}
