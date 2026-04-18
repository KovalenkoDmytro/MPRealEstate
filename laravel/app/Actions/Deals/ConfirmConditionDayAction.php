<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Notifications\ConditionDayConfirmed;
use Lorisleiva\Actions\Concerns\AsAction;

class ConfirmConditionDayAction
{
    use AsAction;

    public function handle(Deal $deal): void
    {
        $deal->is_condition_day_confirmed = true;
        $deal->condition_day_confirmed_at = now();
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();

        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new ConditionDayConfirmed($deal));
        }
    }
}
