<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Notifications\PossessionDaySet;
use Lorisleiva\Actions\Concerns\AsAction;

class SetPossessionDayAction
{
    use AsAction;

    public function handle(string $possessionDay, Deal $deal): void
    {
        if (! is_null($deal->possession_day)) {
            throw new \RuntimeException(__('deals.errors.possession_day_already_set'));
        }

        $deal->possession_day = $possessionDay;
        $deal->possession_day_selected_at = now();
        $deal->save();

        $seller = $deal->users()->where('role', 'seller')->first();

        if ($seller) {
            $deal->load('listing');
            $seller->notify(new PossessionDaySet($deal));
        }
    }
}
