<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Models\User;
use App\Notifications\DepositMarkedAsMade;
use Lorisleiva\Actions\Concerns\AsAction;

class MarkDepositMadeAction
{
    use AsAction;

    public function handle(bool $made, string $madeAt, Deal $deal, User $user): void
    {
        if (! $deal->users->contains($user)) {
            abort(403, __('global.errors.unauthorized'));
        }

        if ($deal->is_security_deposit_made) {
            return;
        }

        $deal->is_security_deposit_made = $made;
        $deal->security_deposit_made_at = $madeAt;
        $deal->save();

        $seller = $deal->users()->where('role', 'seller')->first();

        if ($seller) {
            $deal->load('listing');
            $seller->notify(new DepositMarkedAsMade($deal));
        }
    }
}
