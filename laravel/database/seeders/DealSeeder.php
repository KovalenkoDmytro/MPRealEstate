<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Buyer;
use App\Models\Deal;
use App\Models\ListingView;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class DealSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::query()->where('email', 'seller@example.com')->first();
        $sellerTwo = User::query()->where('email', 'seller2@example.com')->first();
        $buyer = User::query()->where('email', 'buyer@example.com')->first();
        $buyerTwo = User::query()->where('email', 'buyer2@example.com')->first();
        $lawyer = User::query()->where('email', 'lawyer@example.com')->first();

        if (! $seller || ! $sellerTwo || ! $buyer || ! $buyerTwo) {
            $this->command?->warn('Demo users are missing. Skipping DealSeeder presentation scenarios.');

            return;
        }

        $presentationListings = $this->resolvePresentationListings(
            sellers: collect([$seller, $sellerTwo]),
            requiredCount: 9,
        );

        $this->seedAppointmentShowcase(
            seller: $seller,
            sellerTwo: $sellerTwo,
            buyer: $buyer,
            buyerTwo: $buyerTwo,
            listings: $presentationListings,
        );

        $this->seedDealShowcase(
            seller: $seller,
            sellerTwo: $sellerTwo,
            buyer: $buyer,
            buyerTwo: $buyerTwo,
            lawyer: $lawyer,
            listings: $presentationListings,
        );

        $this->seedSellerAppointmentVolume();
        $this->seedListingEngagement();
    }

    private function resolvePresentationListings(Collection $sellers, int $requiredCount): Collection
    {
        $listings = RealEstateListing::query()
            ->whereIn('seller_id', $sellers->pluck('id'))
            ->whereNull('deleted_at')
            ->orderBy('id')
            ->get();

        while ($listings->count() < $requiredCount) {
            /** @var User $seller */
            $seller = $sellers[$listings->count() % $sellers->count()];

            $listings->push(
                RealEstateListing::factory()
                    ->for($seller, 'seller')
                    ->create([
                        'property_taxes' => random_int(1800, 4200),
                        'status' => 'available',
                    ])
            );
        }

        return $listings->take($requiredCount)->values();
    }

    private function seedAppointmentShowcase(
        User $seller,
        User $sellerTwo,
        User $buyer,
        User $buyerTwo,
        Collection $listings,
    ): void {
        $pendingListing = $listings[0];
        $acceptedListing = $listings[1];
        $rejectedListing = $listings[2];
        $cancelledListing = $listings[3];

        $pendingListing->update(['status' => 'available']);
        $acceptedListing->update(['status' => 'available']);
        $rejectedListing->update(['status' => 'available']);
        $cancelledListing->update(['status' => 'available']);

        Appointment::factory()
            ->pending()
            ->create([
                'buyer_id' => $buyer->id,
                'seller_id' => $seller->id,
                'real_estate_listing_id' => $pendingListing->id,
                'scheduled_at' => CarbonImmutable::now()->addDay()->setTime(14, 30),
            ]);

        Appointment::factory()
            ->accepted()
            ->create([
                'buyer_id' => $buyer->id,
                'seller_id' => $seller->id,
                'real_estate_listing_id' => $acceptedListing->id,
                'scheduled_at' => CarbonImmutable::now()->addDays(2)->setTime(11, 0),
                'access_code' => 'SHOW-2048',
            ]);

        Appointment::factory()
            ->rejected()
            ->create([
                'buyer_id' => $buyerTwo->id,
                'seller_id' => $sellerTwo->id,
                'real_estate_listing_id' => $rejectedListing->id,
                'scheduled_at' => CarbonImmutable::now()->addDays(3)->setTime(16, 0),
                'rejection_reason' => 'The owner is unavailable at that time. Please request another slot tomorrow afternoon.',
            ]);

        Appointment::factory()
            ->cancelledByBuyer()
            ->create([
                'buyer_id' => $buyerTwo->id,
                'seller_id' => $sellerTwo->id,
                'real_estate_listing_id' => $cancelledListing->id,
                'scheduled_at' => CarbonImmutable::now()->addDays(4)->setTime(13, 0),
            ]);
    }

    private function seedSellerAppointmentVolume(): void
    {
        $seller = User::query()->where('email', 'seller@example.com')->first();

        if (! $seller) {
            return;
        }

        $listingIds = RealEstateListing::query()
            ->where('seller_id', $seller->getKey())
            ->pluck('id');

        if ($listingIds->isEmpty()) {
            return;
        }

        $buyers = User::query()
            ->whereIn('email', ['buyer@example.com', 'buyer2@example.com'])
            ->get();

        if ($buyers->isEmpty()) {
            return;
        }

        $scenarios = [
            ['state' => 'pending', 'count' => 200, 'scheduled_at' => fn () => now()->addDays(rand(1, 30))->addHours(rand(0, 23))->addMinutes(rand(0, 59))],
            ['state' => 'accepted', 'count' => 150, 'scheduled_at' => fn () => rand(0, 1) ? now()->subDays(rand(1, 30))->addHours(rand(0, 23)) : now()->addDays(rand(1, 14))->addHours(rand(0, 23))],
            ['state' => 'rejected', 'count' => 100, 'scheduled_at' => fn () => now()->subDays(rand(5, 60))->addHours(rand(0, 23))->addMinutes(rand(0, 59))],
            ['state' => 'cancelledByBuyer', 'count' => 50, 'scheduled_at' => fn () => now()->subDays(rand(1, 45))->addHours(rand(0, 23))->addMinutes(rand(0, 59))],
        ];

        foreach ($scenarios as $scenario) {
            for ($i = 0; $i < $scenario['count']; $i++) {
                $buyer = $buyers->random();

                Appointment::factory()
                    ->{$scenario['state']}()
                    ->create([
                        'buyer_id' => $buyer->getKey(),
                        'seller_id' => $seller->getKey(),
                        'real_estate_listing_id' => $listingIds->random(),
                        'scheduled_at' => ($scenario['scheduled_at'])(),
                    ]);
            }
        }
    }

    private function seedDealShowcase(
        User $seller,
        User $sellerTwo,
        User $buyer,
        User $buyerTwo,
        ?User $lawyer,
        Collection $listings,
    ): void {
        $dealScenarios = [
            [
                'listing' => $listings[4],
                'seller' => $seller,
                'buyer' => $buyer,
                'amount' => 445000,
                'offer_status' => 'accepted',
                'listing_status' => 'pending',
                'deal' => [
                    'name' => 'Presentation Deal: Offer Accepted',
                    'deal_message' => 'Offer accepted and waiting for the seller to set the security deposit.',
                ],
            ],
            [
                'listing' => $listings[5],
                'seller' => $seller,
                'buyer' => $buyerTwo,
                'amount' => 512500,
                'offer_status' => 'accepted',
                'listing_status' => 'pending',
                'deal' => [
                    'name' => 'Presentation Deal: Deposit Requested',
                    'deal_message' => 'Seller has requested a security deposit and is waiting for payment.',
                    'security_deposit' => 15000,
                    'security_deposit_set_at' => CarbonImmutable::now()->subDays(2),
                ],
            ],
            [
                'listing' => $listings[6],
                'seller' => $sellerTwo,
                'buyer' => $buyer,
                'amount' => 589000,
                'offer_status' => 'accepted',
                'listing_status' => 'pending',
                'deal' => [
                    'name' => 'Presentation Deal: Deposit Made',
                    'deal_message' => 'Buyer paid the deposit and is waiting for seller confirmation.',
                    'security_deposit' => 20000,
                    'security_deposit_set_at' => CarbonImmutable::now()->subDays(4),
                    'is_security_deposit_made' => true,
                    'security_deposit_made_at' => CarbonImmutable::now()->subDays(3),
                ],
            ],
            [
                'listing' => $listings[7],
                'seller' => $sellerTwo,
                'buyer' => $buyerTwo,
                'amount' => 640000,
                'offer_status' => 'accepted',
                'listing_status' => 'pending',
                'deal' => [
                    'name' => 'Presentation Deal: Condition Day',
                    'deal_message' => 'Deposit confirmed and buyer selected a condition day.',
                    'security_deposit' => 25000,
                    'security_deposit_set_at' => CarbonImmutable::now()->subDays(8),
                    'is_security_deposit_made' => true,
                    'security_deposit_made_at' => CarbonImmutable::now()->subDays(7),
                    'is_security_deposit_confirmed' => true,
                    'security_deposit_confirmed_at' => CarbonImmutable::now()->subDays(6),
                    'condition_day' => CarbonImmutable::now()->addDays(5),
                    'condition_day_selected_at' => CarbonImmutable::now()->subDays(2),
                ],
            ],
            [
                'listing' => $listings[8],
                'seller' => $seller,
                'buyer' => $buyer,
                'amount' => 715000,
                'offer_status' => 'accepted',
                'listing_status' => 'sold',
                'deal' => [
                    'name' => 'Presentation Deal: Completed Closing',
                    'deal_message' => 'All steps were confirmed and the property has closed successfully.',
                    'security_deposit' => 30000,
                    'security_deposit_set_at' => CarbonImmutable::now()->subDays(18),
                    'is_security_deposit_made' => true,
                    'security_deposit_made_at' => CarbonImmutable::now()->subDays(17),
                    'is_security_deposit_confirmed' => true,
                    'security_deposit_confirmed_at' => CarbonImmutable::now()->subDays(16),
                    'condition_day' => CarbonImmutable::now()->subDays(10),
                    'condition_day_selected_at' => CarbonImmutable::now()->subDays(14),
                    'is_condition_day_confirmed' => true,
                    'condition_day_confirmed_at' => CarbonImmutable::now()->subDays(13),
                    'possession_day' => CarbonImmutable::now()->subDays(2),
                    'possession_day_selected_at' => CarbonImmutable::now()->subDays(8),
                    'is_possession_day_confirmed' => true,
                    'possession_day_confirmed_at' => CarbonImmutable::now()->subDays(7),
                    'is_completed' => true,
                    'completed_at' => CarbonImmutable::now()->subDay(),
                ],
            ],
        ];

        foreach ($dealScenarios as $scenario) {
            /** @var RealEstateListing $listing */
            $listing = $scenario['listing'];
            /** @var User $scenarioSeller */
            $scenarioSeller = $scenario['seller'];
            /** @var User $scenarioBuyer */
            $scenarioBuyer = $scenario['buyer'];

            $listing->update(['status' => $scenario['listing_status']]);

            Offer::factory()->create([
                'real_estate_listing_id' => $listing->id,
                'buyer_id' => $scenarioBuyer->id,
                'amount' => $scenario['amount'],
                'status' => $scenario['offer_status'],
                'message' => $scenario['deal']['deal_message'],
            ]);

            $deal = Deal::factory()->create(array_merge(
                [
                    'real_estate_listing_id' => $listing->id,
                    'amount' => $scenario['amount'],
                ],
                $scenario['deal'],
            ));

            $participants = [$scenarioSeller->id, $scenarioBuyer->id];

            if ($lawyer) {
                $participants[] = $lawyer->id;
            }

            $deal->users()->syncWithoutDetaching($participants);
        }

        $brokenListing = $listings[3];
        $brokenListing->update(['status' => 'available']);

        $brokenOffer = Offer::factory()->create([
            'real_estate_listing_id' => $brokenListing->id,
            'buyer_id' => $buyerTwo->id,
            'amount' => 398500,
            'status' => 'accepted',
            'message' => 'Accepted once, then reopened after both sides agreed to break the deal.',
        ]);

        $brokenDeal = Deal::factory()->create([
            'real_estate_listing_id' => $brokenListing->id,
            'name' => 'Presentation Deal: Broken and Reopened',
            'amount' => $brokenOffer->amount,
            'deal_message' => $brokenOffer->message,
            'security_deposit' => 12000,
            'security_deposit_set_at' => CarbonImmutable::now()->subDays(11),
            'is_broken' => true,
            'broken_at' => CarbonImmutable::now()->subDays(5),
        ]);

        $brokenParticipants = [$sellerTwo->id, $buyerTwo->id];

        if ($lawyer) {
            $brokenParticipants[] = $lawyer->id;
        }

        $brokenDeal->users()->syncWithoutDetaching($brokenParticipants);
    }

    private function seedListingEngagement(): void
    {
        $seller = User::query()->where('email', 'seller@example.com')->first();

        if (! $seller) {
            return;
        }

        $listings = RealEstateListing::query()
            ->where('seller_id', $seller->getKey())
            ->get();

        $buyers = Buyer::query()
            ->whereIn('email', ['buyer@example.com', 'buyer2@example.com'])
            ->get();

        if ($listings->isEmpty() || $buyers->isEmpty()) {
            return;
        }

        $now = CarbonImmutable::now();

        foreach ($listings as $listing) {
            $totalViews = random_int(40, 80);
            $recentViews = (int) round($totalViews * 0.3);
            $olderViews = $totalViews - $recentViews;

            $viewRows = [];

            for ($i = 0; $i < $olderViews; $i++) {
                $viewedAt = $now->subDays(random_int(8, 90))
                    ->subHours(random_int(0, 23))
                    ->subMinutes(random_int(0, 59));

                $viewRows[] = [
                    'real_estate_listing_id' => $listing->getKey(),
                    'user_id' => $buyers->random()->getKey(),
                    'viewed_at' => $viewedAt,
                    'created_at' => $viewedAt,
                    'updated_at' => $viewedAt,
                ];
            }

            for ($i = 0; $i < $recentViews; $i++) {
                $viewedAt = $now->subDays(random_int(0, 6))
                    ->subHours(random_int(0, 23))
                    ->subMinutes(random_int(0, 59));

                $viewRows[] = [
                    'real_estate_listing_id' => $listing->getKey(),
                    'user_id' => $buyers->random()->getKey(),
                    'viewed_at' => $viewedAt,
                    'created_at' => $viewedAt,
                    'updated_at' => $viewedAt,
                ];
            }

            ListingView::query()->insert($viewRows);

            $favoriteBuyers = $buyers->random(random_int(1, min(2, $buyers->count())));

            foreach ($favoriteBuyers as $buyer) {
                $listing->favoriteByBuyer()->syncWithoutDetaching([$buyer->getKey()]);
            }
        }
    }
}
