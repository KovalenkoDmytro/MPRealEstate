## Unverified Email Login Flow (2026-04-24)

### Batch 1 — Redirect unverified users to resend verification screen
- [x] Add a regression test for login with an existing unverified email account
- [x] Redirect unverified login attempts to `verify-email?resendVerificationEmail=...` instead of returning non-clickable HTML inside a validation error

## Review
- Added feature regression tests that prove:
  an existing unverified user is redirected to the resend verification screen on login
  an existing unverified account is reused on registration and receives a fresh verification notification instead of triggering a hard duplicate-email dead end
- Updated the login flow to redirect unverified users directly to `verify-email` with the email prefilled in the resend form.
- Updated registration validation/service flow so verified emails still remain unique, while existing unverified emails are handled by resending verification rather than attempting to create a duplicate account.
- Verified with:
  `docker compose exec php php artisan test tests/Feature/Auth/UnverifiedEmailLoginTest.php`
- Known remaining gap outside this batch:
  mail transport failures themselves are still possible and are separate from this resend/redirect UX fix.

## Deals Empty State (2026-04-24)

### Batch 1 — Deals page empty state
- [x] Add a dedicated empty-state section in `laravel/resources/js/components/deals/DealsList.tsx` when the deals list is empty
- [x] Keep the existing overview cards and deal cards unchanged when deals exist

## Review
- Replaced the empty deals list with a full empty-state section in `DealsList`, so buyer, seller, and lawyer deal index pages all inherit the same behavior.
- Added role-aware helper copy and CTA:
  buyer → `Browse Listings`
  seller → `My Listings`
  lawyer → informational state without CTA
- Verification:
  `npm exec tsc --noEmit` was attempted, but the run is still blocked by unrelated pre-existing `swiper/css` side-effect import type errors in other files, not by the deals empty-state change.

## Offers Empty State (2026-04-24)

### Batch 1 — Offers page empty state
- [x] Replace plain `No offers available.` text with a dedicated empty-state section in `laravel/resources/js/components/offers/OffersGrid/OffersGrid.tsx`
- [x] Keep the existing offers grid and pagination behavior unchanged when offers exist

## Review
- Replaced the plain `No offers available.` line in `OffersGrid` with a full empty-state section styled consistently with the seller dashboard empty states.
- Added role-aware helper copy and CTA:
  buyer → `Browse Listings`
  seller → `Add New Listing`
- Verification:
  `npm exec tsc --noEmit` was attempted, but the run is currently blocked by unrelated pre-existing `swiper/css` side-effect import type errors in other files, not by the offers empty-state change.

# SOLID Refactoring Plan

## Batches (ordered by impact, ≤3 files each)

### Batch 1 — Quick targeted fixes (bugs + type correctness)
- [ ] `Lawyer::getAllDeals()` — `$this->lawyer->deals()` → `$this->deals()` (`app/Models/Lawyer.php`)
- [ ] `Seller::onlySellers()` — return type `User` → `Builder`, rename to `querySellers()` (`app/Models/Seller.php`)
- [ ] Incorrect union return types on relationship methods — remove model class from union (`Deal`, `RealEstateListing`, `Seller`, `Buyer`)
- [ ] `DealService::createDealFromOffer` — `DB::table(...)` → `$listing->update(...)` (`app/Services/DealService.php`)
- [ ] `RealEstateListingPolicy::create` — return type `User|bool` → `bool`

### Batch 2 — AppointmentService repeated role scope (OCP/SRP)
- [ ] Add `Appointment::scopeForUser(Builder $query, User $user)` Eloquent scope
- [ ] Replace 8x copy-pasted if/elseif in `AppointmentService` with single `scopeForUser` call

### Batch 3 — DealService decomposition (SRP)
- [ ] Extract `SetSecurityDepositAction` (lines 36–57)
- [ ] Extract `MarkDepositMadeAction` (lines 59–82)
- [ ] Extract `ConfirmDepositAction` (lines 84–98)
- [ ] Extract `SetConditionDayAction` (lines 101–138)
- [ ] Extract `SetPossessionDayAction` (lines 141–178)
- [ ] Extract `ConfirmPossessionDayAction`
- [ ] Extract `InviteLawyerToDealAction` (lines 181–212)
- [ ] Extract `CreateDealFromOfferAction` (lines 214–230)
- [ ] Extract `BreakDealAction` + `RespondToBreakAction` (lines 239–329)
- [ ] Extract `DealStatisticsService` (lines 334–356)
- [ ] Update `DealController` to use new Actions

### Batch 4 — AppointmentService decomposition (SRP)
- [ ] Extract `AppointmentQueryService` (8 query methods)
- [ ] Extract `AppointmentStatisticsService` (seller/buyer stats)
- [ ] Keep `AppointmentService` for lifecycle mutations only

### Batch 5 — Service ISP: remove Request/JsonResponse dependency
- [ ] `DealService` — accept scalars/DTOs, return void/domain objects
- [ ] `OfferService` — accept scalars/DTOs, return void/domain objects
- [ ] `RealEstateListingService` — accept scalars/DTOs, return void/domain objects
- [ ] Update controllers to handle response formatting

### Batch 6 — Role-based view resolver (OCP)
- [ ] Create `ViewResolver` helper/service
- [ ] Replace 6x `match($role)` / `if ($role === ...)` chains across controllers

### Batch 7 — Remove auth() facade from services (DIP)
- [ ] Pass `User $user` explicitly to all service methods that call `auth()->user()`
- [ ] Update all callers (controllers)

## Review
_To be filled after each batch._
