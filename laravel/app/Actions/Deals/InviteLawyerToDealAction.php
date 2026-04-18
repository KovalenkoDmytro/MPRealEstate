<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Models\User;
use App\Notifications\LawyerInvitedToDeal;
use Lorisleiva\Actions\Concerns\AsAction;

class InviteLawyerToDealAction
{
    use AsAction;

    public function handle(string $lawyerCode, string $inviterRole, Deal $deal): void
    {
        $lawyer = User::query()
            ->where('lawyer_number', $lawyerCode)
            ->whereHas('roles', fn ($q) => $q->where('name', 'lawyer'))
            ->first();

        if (! $lawyer) {
            throw new \RuntimeException(__('deals.errors.no_lawyer_found'));
        }

        if ($deal->users->contains($lawyer->getKey())) {
            throw new \RuntimeException(__('deals.errors.lawyer_already_in_deal'));
        }

        if ($inviterRole === 'buyer') {
            $lawyer->is_buyer_lawyer = true;
        } elseif ($inviterRole === 'seller') {
            $lawyer->is_seller_lawyer = true;
        }

        $lawyer->save();
        $deal->users()->attach($lawyer->getKey());
        $lawyer->notify(new LawyerInvitedToDeal($deal));
    }
}
