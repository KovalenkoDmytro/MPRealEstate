<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Notifications\SecurityDepositSet;
use Lorisleiva\Actions\Concerns\AsAction;

class SetSecurityDepositAction
{
    use AsAction;

    public function handle(float $amount, Deal $deal): void
    {
        if (! is_null($deal->security_deposit)) {
            throw new \RuntimeException(__('deals.errors.security_deposit_already_set'));
        }

        $deal->security_deposit = $amount;
        $deal->security_deposit_set_at = now();
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();

        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new SecurityDepositSet($deal));
        }
    }
}
