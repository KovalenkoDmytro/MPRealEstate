<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Notifications\DepositConfirmed;
use Carbon\Carbon;
use Lorisleiva\Actions\Concerns\AsAction;

class ConfirmDepositAction
{
    use AsAction;

    public function handle(bool $confirmed, string $confirmedAt, Deal $deal): Deal
    {
        $deal->is_security_deposit_confirmed = $confirmed;
        $deal->security_deposit_confirmed_at = Carbon::parse($confirmedAt);
        $deal->save();

        $buyer = $deal->users()->where('role', 'buyer')->first();

        if ($buyer) {
            $deal->load('listing');
            $buyer->notify(new DepositConfirmed($deal));
        }

        return $deal;
    }
}
