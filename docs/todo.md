# SOLID Refactoring Plan

## Inertia Bootstrap Fix (small batch)
- [x] Fix `createInertiaApp` typing/build blocker in `laravel/resources/js/app.tsx`
- [x] Add missing frontend style module declarations in `laravel/resources/js/types/global.d.ts`
- [x] Rebuild frontend assets without `public/hot` and verify Inertia boot
- [x] Document result in Review section

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

- Inertia bootstrap issue addressed by restoring valid React/Inertia page resolution, moving CSS declarations into a dedicated `css.d.ts`, removing stale `public/hot`, and producing a successful Vite production build. Verified `/login` now serves `data-page` plus `public/build` assets instead of dev-server assets.
