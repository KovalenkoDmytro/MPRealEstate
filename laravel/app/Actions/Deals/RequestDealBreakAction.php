<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Models\DealBreakRequest;
use App\Models\User;
use App\Notifications\DealBreakRequested;
use Lorisleiva\Actions\Concerns\AsAction;

class RequestDealBreakAction
{
    use AsAction;

    public function handle(string $message, Deal $deal, User $initiator): void
    {
        if ($deal->is_completed) {
            throw new \RuntimeException(__('deals.errors.deal_completed_cannot_break'));
        }

        if ($deal->breakRequest) {
            throw new \RuntimeException(__('deals.errors.break_request_exists'));
        }

        DealBreakRequest::query()->create([
            'deal_id' => $deal->getKey(),
            'initiator_id' => $initiator->getKey(),
            'status' => 'pending',
            'message' => $message,
        ]);

        $mainSides = $deal->users()->whereIn('role', ['buyer', 'seller'])->get();

        foreach ($mainSides as $user) {
            $user->notify(new DealBreakRequested($deal));
        }
    }
}
