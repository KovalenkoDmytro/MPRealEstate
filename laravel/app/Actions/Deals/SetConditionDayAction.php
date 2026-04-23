<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Notifications\ConditionDaySet;
use Lorisleiva\Actions\Concerns\AsAction;

class SetConditionDayAction
{
    use AsAction;

    public function handle(string $conditionDay, Deal $deal): void
    {
        if (! is_null($deal->condition_day)) {
            throw new \RuntimeException(__('deals.errors.condition_day_already_set'));
        }

        $deal->condition_day = $conditionDay;
        $deal->condition_day_selected_at = now();
        $deal->save();

        $seller = $deal->users()->where('role', 'seller')->first();

        if ($seller) {
            $deal->load('listing');
            $seller->notify(new ConditionDaySet($deal));
        }
    }
}
