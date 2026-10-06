<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Deal;
use App\Models\DealBreakRequest;
use App\Models\ListingView;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PresentationScenarioSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::query()->whereIn('email', ['seller@example.com', 'seller2@example.com'])->orderBy('email')->get();
        $buyers = User::query()->whereIn('email', ['buyer@example.com', 'buyer2@example.com'])->orderBy('email')->get();
        $lawyer = User::query()->where('email', 'lawyer@example.com')->first();
        $properties = json_decode(File::get(database_path('data/properties.json')), true, flags: JSON_THROW_ON_ERROR);
        $listings = RealEstateListing::query()->whereIn('seller_id', $sellers->modelKeys())
            ->whereIn('title', array_column($properties, 'title'))
            ->whereHas('mainImage')->orderByDesc('id')->take(11)->get()->sortBy('id')->values();

        if ($sellers->count() !== 2 || $buyers->count() !== 2 || $listings->count() < 9) {
            $this->command?->warn('PresentationScenarioSeeder skipped: two demo sellers, two buyers and at least nine listings with images are required.');

            return;
        }

        $now = CarbonImmutable::now();
        $end = $now->startOfDay()->addMonthsNoOverflow(3);

        DB::transaction(function () use ($sellers, $buyers, $lawyer, $listings, $now, $end): void {
            $stages = ['viewing_pending', 'viewing_approved', 'negotiation', 'started', 'deposit', 'conditions', 'break_requested', 'broken', 'closed', 'possession', 'possession'];

            foreach ($listings as $index => $listing) {
                $this->resetListingScenario($listing);
                $seller = $sellers[$index % 2];
                $buyer = $buyers[$index % 2];
                $listing->update([
                    'seller_id' => $seller->id,
                    'status' => 'available',
                    'created_at' => $now->subDays(60 + $index),
                ]);
                $stage = $stages[$index] ?? 'viewing_pending';

                if (in_array($stage, ['viewing_pending', 'viewing_approved'])) {
                    Appointment::factory()->create([
                        'real_estate_listing_id' => $listing->id,
                        'seller_id' => $seller->id,
                        'buyer_id' => $buyer->id,
                        'scheduled_at' => $stage === 'viewing_pending' ? $now->addDay()->setTime(14, 30) : $now->addDays(2)->setTime(11, 30),
                        'status' => $stage === 'viewing_pending' ? 'pending' : 'accepted',
                        'access_code' => $stage === 'viewing_approved' ? 'SHOW-2048' : null,
                        'created_at' => $now->subDay(),
                        'updated_at' => $stage === 'viewing_pending' ? $now->subDay() : $now->subHours(2),
                    ]);

                    continue;
                }

                if ($stage === 'negotiation') {
                    foreach ($buyers as $buyerIndex => $interestedBuyer) {
                        Offer::factory()->create([
                            'real_estate_listing_id' => $listing->id,
                            'buyer_id' => $interestedBuyer->id,
                            'amount' => round((float) $listing->price * ($buyerIndex === 0 ? 0.98 : 0.94) / 500) * 500,
                            'status' => $buyerIndex === 0 ? 'pending' : 'rejected',
                            'message' => $buyerIndex === 0
                                ? 'Mortgage pre-approval is in place. Offer is subject to financing and a satisfactory home inspection.'
                                : 'We can offer a flexible possession date, subject to financing approval.',
                            'created_at' => $now->subDays($buyerIndex === 0 ? 1 : 4),
                            'updated_at' => $now->subDays($buyerIndex === 0 ? 1 : 3),
                        ]);
                    }

                    continue;
                }

                $this->seedDeal($listing, $seller, $buyer, $lawyer, $stage, $now, $end, $index);
            }

            $this->seedCalendar($listings, $buyers, $now, $end);
            $this->seedEngagement($listings, $buyers, $now);
        });

        $this->command?->info('Realistic presentation scenarios seeded through '.$end->toDateString().'.');
    }

    private function seedDeal(
        RealEstateListing $listing,
        User $seller,
        User $buyer,
        ?User $lawyer,
        string $stage,
        CarbonImmutable $now,
        CarbonImmutable $end,
        int $index,
    ): void {
        $startedAt = $now->subDays($stage === 'closed' ? 55 : ($stage === 'started' ? 1 : 14 + $index));
        $amount = round((float) $listing->price * 0.985 / 500) * 500;
        $message = 'Offer accepted subject to financing and home inspection. Appliances included as viewed.';
        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'amount' => $amount,
            'status' => 'accepted',
            'message' => $message,
            'created_at' => $startedAt->subDay(),
            'updated_at' => $startedAt,
        ]);
        $attributes = [
            'real_estate_listing_id' => $listing->id,
            'name' => 'Purchase of '.$listing->title,
            'amount' => $offer->amount,
            'deal_message' => $message,
            'created_at' => $startedAt,
            'updated_at' => $now,
        ];

        if ($stage !== 'started') {
            $attributes += [
                'security_deposit' => round($amount * 0.03 / 500) * 500,
                'security_deposit_set_at' => $startedAt->addDay(),
            ];
        }

        if (in_array($stage, ['deposit', 'conditions', 'possession', 'closed'])) {
            $attributes += ['is_security_deposit_made' => true, 'security_deposit_made_at' => $startedAt->addDays(2)];
        }

        if (in_array($stage, ['conditions', 'possession', 'closed'])) {
            $attributes += [
                'is_security_deposit_confirmed' => true,
                'security_deposit_confirmed_at' => $startedAt->addDays(3),
                'condition_day' => $stage === 'conditions' ? $now->addDays(7)->setTime(17, 0) : $startedAt->addDays(10)->setTime(17, 0),
                'condition_day_selected_at' => $startedAt->addDays(4),
            ];
        }

        if (in_array($stage, ['possession', 'closed'])) {
            $attributes += [
                'is_condition_day_confirmed' => true,
                'condition_day_confirmed_at' => $startedAt->addDays(5),
                'possession_day' => $stage === 'closed' ? $now->subDays(2)->setTime(12, 0)
                    : ($index % 2 === 0 ? $end : $now->addMonthNoOverflow())->setTime(12, 0),
                'possession_day_selected_at' => $startedAt->addDays(11),
                'is_possession_day_confirmed' => true,
                'possession_day_confirmed_at' => $startedAt->addDays(12),
            ];
        }

        if ($stage === 'closed') {
            $attributes += ['is_completed' => true, 'completed_at' => $now->subDays(2)->setTime(15, 0)];
        }

        if ($stage === 'broken') {
            $attributes += ['is_broken' => true, 'broken_at' => $now->subDays(5)];
        }

        $deal = Deal::factory()->create($attributes);
        $deal->users()->sync(array_filter([$seller->id, $buyer->id, $lawyer?->id]));
        $listing->update(['status' => match ($stage) {
            'closed' => 'sold',
            'broken' => 'available',
            default => 'pending',
        }]);

        Appointment::factory()->accepted()->create([
            'real_estate_listing_id' => $listing->id,
            'seller_id' => $seller->id,
            'buyer_id' => $buyer->id,
            'scheduled_at' => $startedAt->subDays(2)->setTime(15, 0),
            'created_at' => $startedAt->subDays(4),
            'updated_at' => $startedAt->subDays(3),
        ]);

        if (in_array($stage, ['broken', 'break_requested'])) {
            $requestedAt = $stage === 'broken' ? $now->subDays(6) : $now->subDay();
            DealBreakRequest::query()->create([
                'deal_id' => $deal->id,
                'initiator_id' => $buyer->id,
                'status' => $stage === 'broken' ? 'accepted' : 'pending',
                'message' => 'Financing could not be approved under the agreed terms. Requesting mutual release from the purchase agreement.',
                'created_at' => $requestedAt,
                'updated_at' => $stage === 'broken' ? $attributes['broken_at'] : $requestedAt,
            ]);
        }
    }

    private function seedCalendar(Collection $listings, Collection $buyers, CarbonImmutable $now, CarbonImmutable $end): void
    {
        $availableBySeller = $listings->where('status', 'available')->groupBy('seller_id');

        for ($day = $now->startOfDay()->subDays(30), $dayIndex = 0; $day->lte($end); $day = $day->addDay(), $dayIndex++) {
            foreach ($availableBySeller->values() as $sellerIndex => $sellerListings) {
                $listing = $sellerListings->values()[$dayIndex % $sellerListings->count()];
                $scheduledAt = $day->setTime($day->isWeekend() ? 11 + $sellerIndex * 2 : 16 + $sellerIndex * 2, 0);
                $historical = $scheduledAt->lt($now);
                $status = $historical ? match ($dayIndex % 10) {
                    0, 1 => 'rejected',
                    2 => 'cancelled by buyer',
                    default => 'accepted',
                } : ($dayIndex % 5 === 0 ? 'pending' : 'accepted');
                $requestedAt = $historical ? $scheduledAt->subDays(3) : $now->subDays(1 + $dayIndex % 5);
                $respondedAt = $historical ? $scheduledAt->subDays(2) : $now->subHours(2);

                Appointment::factory()->create([
                    'real_estate_listing_id' => $listing->id,
                    'seller_id' => $listing->seller_id,
                    'buyer_id' => $buyers[($dayIndex + $sellerIndex) % $buyers->count()]->id,
                    'scheduled_at' => $scheduledAt,
                    'status' => $status,
                    'access_code' => $status === 'accepted' ? 'SHOW-'.str_pad((string) ($dayIndex * 2 + $sellerIndex), 4, '0', STR_PAD_LEFT) : null,
                    'rejection_reason' => $status === 'rejected' ? 'The owner is unavailable at this time. Please request an afternoon viewing.' : null,
                    'buyer_cancelled_at' => $status === 'cancelled by buyer' ? $respondedAt : null,
                    'created_at' => $requestedAt,
                    'updated_at' => $status === 'pending' ? $requestedAt : $respondedAt,
                ]);
            }
        }
    }

    private function seedEngagement(Collection $listings, Collection $buyers, CarbonImmutable $now): void
    {
        foreach ($listings as $index => $listing) {
            $listing->views()->delete();
            $rows = [];
            $count = 40 + ($index % 5) * 12;

            for ($viewIndex = 0; $viewIndex < $count; $viewIndex++) {
                $viewedAt = $now->subDays($viewIndex % 55)->subMinutes(15 + $viewIndex * 7);
                $rows[] = [
                    'real_estate_listing_id' => $listing->id,
                    'user_id' => $buyers[$viewIndex % $buyers->count()]->id,
                    'viewed_at' => $viewedAt,
                    'created_at' => $viewedAt,
                    'updated_at' => $viewedAt,
                ];
            }

            ListingView::query()->insert($rows);
            $listing->update(['views_count' => $count, 'unique_viewers_count' => $buyers->count()]);
            $listing->favoriteByBuyer()->syncWithoutDetaching([$buyers[$index % $buyers->count()]->id]);
        }
    }

    private function resetListingScenario(RealEstateListing $listing): void
    {
        $listing->appointments()->delete();
        $listing->offers()->delete();

        foreach (Deal::query()->where('real_estate_listing_id', $listing->id)->get() as $deal) {
            $deal->users()->detach();
            $deal->delete();
        }
    }
}
