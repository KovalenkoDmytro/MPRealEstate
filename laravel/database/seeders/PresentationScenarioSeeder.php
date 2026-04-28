<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Deal;
use App\Models\DealBreakRequest;
use App\Models\Offer;
use App\Models\RealEstateListing;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PresentationScenarioSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::query()->where('email', 'seller@example.com')->first();
        $sellerTwo = User::query()->where('email', 'seller2@example.com')->first();
        $buyer = User::query()->where('email', 'buyer@example.com')->first();
        $buyerTwo = User::query()->where('email', 'buyer2@example.com')->first();
        $lawyer = User::query()->where('email', 'lawyer@example.com')->first();

        if (! $seller || ! $sellerTwo || ! $buyer || ! $buyerTwo) {
            $this->command?->warn('PresentationScenarioSeeder skipped: demo users are missing.');

            return;
        }

        $listings = RealEstateListing::query()
            ->whereIn('seller_id', [$seller->id, $sellerTwo->id])
            ->whereHas('mainImage')
            ->orderBy('id')
            ->take(9)
            ->get()
            ->values();

        if ($listings->count() < 9) {
            $this->command?->warn('PresentationScenarioSeeder skipped: not enough listings with images.');

            return;
        }

        DB::transaction(function () use ($seller, $sellerTwo, $buyer, $buyerTwo, $lawyer, $listings): void {
            $this->seedViewingPendingScenario($listings[0], $seller, $buyer);
            $this->seedViewingApprovedScenario($listings[1], $seller, $buyerTwo);
            $this->seedOfferNegotiationScenario($listings[2], $sellerTwo, $buyer, $buyerTwo);
            $this->seedDealStartedScenario($listings[3], $seller, $buyer, $lawyer);
            $this->seedDepositInProgressScenario($listings[4], $sellerTwo, $buyerTwo, $lawyer);
            $this->seedConditionDayScenario($listings[5], $seller, $buyerTwo, $lawyer);
            $this->seedBreakRequestScenario($listings[6], $sellerTwo, $buyer, $lawyer);
            $this->seedBrokenDealScenario($listings[7], $seller, $buyer, $lawyer);
            $this->seedClosedSaleScenario($listings[8], $sellerTwo, $buyerTwo, $lawyer);
        });

        $this->command?->info('Presentation scenarios seeded successfully.');
        $this->command?->line('Demo scenarios: viewing pending, viewing approved, offer negotiation, active deals, break request, broken deal, closed sale.');
    }

    private function seedViewingPendingScenario(RealEstateListing $listing, User $seller, User $buyer): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Viewing Request Pending',
            'description' => 'Demo listing for showing a pending buyer appointment request awaiting seller approval.',
            'status' => 'available',
            'price' => 468000,
        ]);

        Appointment::factory()
            ->pending()
            ->create([
                'buyer_id' => $buyer->id,
                'seller_id' => $seller->id,
                'real_estate_listing_id' => $listing->id,
                'scheduled_at' => CarbonImmutable::now()->addDay()->setTime(14, 30),
            ]);
    }

    private function seedViewingApprovedScenario(RealEstateListing $listing, User $seller, User $buyer): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Viewing Approved',
            'description' => 'Demo listing for showing a confirmed viewing appointment with access instructions.',
            'status' => 'available',
            'price' => 515000,
        ]);

        Appointment::factory()
            ->accepted()
            ->create([
                'buyer_id' => $buyer->id,
                'seller_id' => $seller->id,
                'real_estate_listing_id' => $listing->id,
                'scheduled_at' => CarbonImmutable::now()->addDays(2)->setTime(11, 0),
                'access_code' => 'SHOW-2048',
            ]);
    }

    private function seedOfferNegotiationScenario(RealEstateListing $listing, User $seller, User $buyer, User $buyerTwo): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Offer Negotiation',
            'description' => 'Demo listing for showing both pending and rejected offers in the seller workflow.',
            'status' => 'available',
            'price' => 559000,
        ]);

        Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'amount' => 541500,
            'status' => 'pending',
            'message' => 'Buyer is interested and waiting for the seller response.',
        ]);

        Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyerTwo->id,
            'amount' => 529000,
            'status' => 'rejected',
            'message' => 'An earlier lower offer was declined by the seller.',
        ]);
    }

    private function seedDealStartedScenario(RealEstateListing $listing, User $seller, User $buyer, ?User $lawyer): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Deal Started',
            'description' => 'Accepted offer with an active deal before the deposit has been configured.',
            'status' => 'pending',
            'price' => 612000,
        ]);

        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'amount' => 605000,
            'status' => 'accepted',
            'message' => 'The offer is accepted and both sides are moving into the deal workspace.',
        ]);

        $deal = Deal::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'name' => 'Presentation - Deal Started',
            'amount' => $offer->amount,
            'deal_message' => $offer->message,
        ]);

        $this->attachParticipants($deal, $seller, $buyer, $lawyer);
    }

    private function seedDepositInProgressScenario(RealEstateListing $listing, User $seller, User $buyer, ?User $lawyer): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Deposit In Progress',
            'description' => 'Security deposit is requested and already marked as paid by the buyer.',
            'status' => 'pending',
            'price' => 685000,
        ]);

        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'amount' => 678500,
            'status' => 'accepted',
            'message' => 'The deposit was requested and the buyer has already sent the funds.',
        ]);

        $deal = Deal::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'name' => 'Presentation - Deposit In Progress',
            'amount' => $offer->amount,
            'deal_message' => $offer->message,
            'security_deposit' => 18000,
            'security_deposit_set_at' => CarbonImmutable::now()->subDays(3),
            'is_security_deposit_made' => true,
            'security_deposit_made_at' => CarbonImmutable::now()->subDays(2),
        ]);

        $this->attachParticipants($deal, $seller, $buyer, $lawyer);
    }

    private function seedConditionDayScenario(RealEstateListing $listing, User $seller, User $buyer, ?User $lawyer): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Condition Day Stage',
            'description' => 'Deposit is fully confirmed and the buyer has selected the condition day.',
            'status' => 'pending',
            'price' => 724000,
        ]);

        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'amount' => 719500,
            'status' => 'accepted',
            'message' => 'The workflow is now waiting for condition day confirmation.',
        ]);

        $deal = Deal::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'name' => 'Presentation - Condition Day Stage',
            'amount' => $offer->amount,
            'deal_message' => $offer->message,
            'security_deposit' => 25000,
            'security_deposit_set_at' => CarbonImmutable::now()->subDays(8),
            'is_security_deposit_made' => true,
            'security_deposit_made_at' => CarbonImmutable::now()->subDays(7),
            'is_security_deposit_confirmed' => true,
            'security_deposit_confirmed_at' => CarbonImmutable::now()->subDays(6),
            'condition_day' => CarbonImmutable::now()->addDays(6),
            'condition_day_selected_at' => CarbonImmutable::now()->subDay(),
        ]);

        $this->attachParticipants($deal, $seller, $buyer, $lawyer);
    }

    private function seedBreakRequestScenario(RealEstateListing $listing, User $seller, User $buyer, ?User $lawyer): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Break Request Pending',
            'description' => 'Active deal where one side has requested to break the agreement and the response is still pending.',
            'status' => 'pending',
            'price' => 648000,
        ]);

        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'amount' => 641250,
            'status' => 'accepted',
            'message' => 'The deal is active, but a break request is waiting for the other side to review.',
        ]);

        $deal = Deal::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'name' => 'Presentation - Break Request Pending',
            'amount' => $offer->amount,
            'deal_message' => $offer->message,
            'security_deposit' => 15000,
            'security_deposit_set_at' => CarbonImmutable::now()->subDays(6),
        ]);

        $this->attachParticipants($deal, $seller, $buyer, $lawyer);

        DealBreakRequest::query()->create([
            'deal_id' => $deal->id,
            'initiator_id' => $buyer->id,
            'status' => 'pending',
            'message' => 'The buyer requested a break so the audience can see the pending approval state.',
        ]);
    }

    private function seedBrokenDealScenario(RealEstateListing $listing, User $seller, User $buyer, ?User $lawyer): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Broken Deal Reopened',
            'description' => 'The deal was broken successfully and the property is available again for new interest.',
            'status' => 'available',
            'price' => 433000,
        ]);

        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'amount' => 429500,
            'status' => 'accepted',
            'message' => 'Historical accepted offer kept for demonstrating a reopened listing after a broken deal.',
        ]);

        $deal = Deal::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'name' => 'Presentation - Broken Deal Reopened',
            'amount' => $offer->amount,
            'deal_message' => $offer->message,
            'security_deposit' => 12000,
            'security_deposit_set_at' => CarbonImmutable::now()->subDays(11),
            'is_broken' => true,
            'broken_at' => CarbonImmutable::now()->subDays(5),
        ]);

        $this->attachParticipants($deal, $seller, $buyer, $lawyer);

        DealBreakRequest::query()->create([
            'deal_id' => $deal->id,
            'initiator_id' => $seller->id,
            'status' => 'accepted',
            'message' => 'The break request was approved and the listing returned to the market.',
        ]);
    }

    private function seedClosedSaleScenario(RealEstateListing $listing, User $seller, User $buyer, ?User $lawyer): void
    {
        $this->resetListingScenario($listing);
        $listing->update([
            'seller_id' => $seller->id,
            'title' => 'Presentation - Closed Sale',
            'description' => 'A completed transaction showing the full path from accepted offer to closed sale.',
            'status' => 'sold',
            'price' => 792000,
        ]);

        $offer = Offer::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'buyer_id' => $buyer->id,
            'amount' => 789000,
            'status' => 'accepted',
            'message' => 'The deal completed successfully and the property is now sold.',
        ]);

        $deal = Deal::factory()->create([
            'real_estate_listing_id' => $listing->id,
            'name' => 'Presentation - Closed Sale',
            'amount' => $offer->amount,
            'deal_message' => $offer->message,
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
        ]);

        $this->attachParticipants($deal, $seller, $buyer, $lawyer);
    }

    private function resetListingScenario(RealEstateListing $listing): void
    {
        $listing->appointments()->delete();
        $listing->offers()->delete();

        $deal = $listing->deal()->first();

        if (! $deal) {
            return;
        }

        $deal->breakRequest()?->delete();
        $deal->users()->detach();
        $deal->delete();
    }

    private function attachParticipants(Deal $deal, User $seller, User $buyer, ?User $lawyer): void
    {
        $participantIds = [$seller->id, $buyer->id];

        if ($lawyer) {
            $participantIds[] = $lawyer->id;
        }

        $deal->users()->syncWithoutDetaching($participantIds);
    }
}
