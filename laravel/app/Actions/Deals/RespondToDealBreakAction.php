<?php

declare(strict_types=1);

namespace App\Actions\Deals;

use App\Models\Deal;
use App\Models\User;
use App\Notifications\DealBreakRequestedApproved;
use App\Notifications\DealBreakRequestedRejected;
use Illuminate\Support\Facades\Storage;
use Lorisleiva\Actions\Concerns\AsAction;

class RespondToDealBreakAction
{
    use AsAction;

    public function handle(Deal $deal, User $responder, string $response): void
    {
        $breakRequest = $deal->breakRequest;

        if (! $breakRequest) {
            throw new \RuntimeException(__('deals.errors.no_break_request'));
        }

        if ($breakRequest->initiator_id === $responder->getKey()) {
            throw new \RuntimeException(__('deals.errors.cannot_respond_own_break'));
        }

        $receiver = $deal->users()
            ->where('user_id', '!=', $responder->getKey())
            ->whereIn('role', ['buyer', 'seller'])
            ->first();

        if ($response === 'approved') {
            $this->approveDealBreak($deal, $breakRequest, $receiver);

            return;
        }

        if ($response === 'rejected') {
            $this->rejectDealBreak($breakRequest, $receiver, $deal);

            return;
        }

        throw new \InvalidArgumentException(__('deals.errors.invalid_response_type'));
    }

    private function approveDealBreak(Deal $deal, mixed $breakRequest, ?User $receiver): void
    {
        $deal->is_broken = true;
        $deal->broken_at = now();

        $deal->files->each(function ($file): void {
            Storage::delete($file->file_path);
            $file->delete();
        });

        $deal->save();

        if ($deal->realEstateListing && ! $deal->realEstateListing->trashed()) {
            $deal->realEstateListing->update(['status' => 'available']);
        }

        $breakRequest->status = 'accepted';
        $breakRequest->save();

        $receiver?->notify(new DealBreakRequestedApproved($deal));
    }

    private function rejectDealBreak(mixed $breakRequest, ?User $receiver, Deal $deal): void
    {
        $breakRequest->status = 'rejected';
        $breakRequest->save();

        $receiver?->notify(new DealBreakRequestedRejected($deal));
    }
}
