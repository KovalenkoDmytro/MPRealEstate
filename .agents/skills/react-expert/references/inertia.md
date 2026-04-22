# Inertia.js v2 + React Reference

> Load when: Inertia page, usePage, useForm, router, Link, WhenVisible,
> deferred props, partial reloads, Inertia forms, page props

---

## Core Concepts

Inertia.js is a **server-driven SPA** — there is no separate REST API.
- Laravel controllers return `Inertia::render('PageName', $props)` responses
- React components in `resources/js/pages/` receive props directly as TypeScript props
- Navigation is handled by Inertia's `router`, not React Router

---

## Page Component Structure

```tsx
// resources/js/pages/Buyer/Listings/Index.tsx
import { Head, Link } from '@inertiajs/react';
import type { RealEstateListing, PaginatedData } from '@/types';

interface Props {
  listings: PaginatedData<RealEstateListing>;
  filters: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

// Pages are loaded by Inertia — export default IS correct for pages
export default function ListingsIndex({ listings, filters }: Props) {
  return (
    <>
      <Head title="Browse Listings" />
      <div>
        {listings.data.map(listing => (
          <Link key={listing.id} href={route('listings.show', listing.id)}>
            {listing.title}
          </Link>
        ))}
      </div>
    </>
  );
}
```

---

## `usePage` — Access Shared Props

```tsx
import { usePage } from '@inertiajs/react';
import type { SharedProps } from '@/types';

// Access globally shared props (auth, flash messages, etc.)
function Navbar() {
  const { props } = usePage<SharedProps>();
  const { auth } = props;

  return (
    <nav>
      <span>{auth.user?.name}</span>
    </nav>
  );
}

// Define SharedProps type to match HandleInertiaRequests middleware
interface SharedProps {
  auth: {
    user: User | null;
  };
  flash: {
    success?: string;
    error?: string;
  };
  ziggy: ZiggyConfig;
}
```

---

## `useForm` — Form Handling

```tsx
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface OfferFormData {
  amount: number;
  message: string;
  deposit_amount: number;
}

export function SubmitOfferForm({ listingId }: { listingId: number }) {
  const { data, setData, post, processing, errors, reset } = useForm<OfferFormData>({
    amount: 0,
    message: '',
    deposit_amount: 0,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    post(route('offers.store', listingId), {
      onSuccess: () => reset(),
      onError: () => { /* errors are auto-populated */ },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={data.amount}
        onChange={e => setData('amount', Number(e.target.value))}
      />
      {errors.amount && <p className="text-red-500">{errors.amount}</p>}

      <textarea
        value={data.message}
        onChange={e => setData('message', e.target.value)}
      />

      <button type="submit" disabled={processing}>
        {processing ? 'Submitting...' : 'Submit Offer'}
      </button>
    </form>
  );
}
```

### useForm with File Uploads

```tsx
const { data, setData, post, processing } = useForm({
  title: '',
  image: null as File | null,
});

// For file uploads, must use forceFormData
post(route('listings.store'), {
  forceFormData: true,
  onSuccess: () => reset(),
});

// File input
<input
  type="file"
  onChange={e => setData('image', e.target.files?.[0] ?? null)}
/>
```

### useForm Methods

| Method | Usage |
|---|---|
| `setData(field, value)` | Update a single field |
| `setData(fields)` | Update multiple fields at once |
| `post(url, options?)` | POST form |
| `put(url, options?)` | PUT form |
| `patch(url, options?)` | PATCH form |
| `delete(url, options?)` | DELETE with form data |
| `reset(...fields)` | Reset to initial values |
| `clearErrors(...fields)` | Clear validation errors |
| `transform(fn)` | Transform data before sending |

---

## `router` — Programmatic Navigation

```tsx
import { router } from '@inertiajs/react';

// Basic navigation
router.visit('/dashboard');
router.visit(route('buyer.dashboard'));

// With options
router.visit(route('listings.index'), {
  method: 'get',
  data: { search: query, page: 1 },
  preserveState: true,    // keep current page component state
  preserveScroll: true,   // don't scroll to top
  replace: true,          // replace history entry
  only: ['listings'],     // partial reload — fetch only these props
});

// After form submission
router.post(route('offers.store', listingId), formData, {
  onSuccess: () => toast.success('Offer submitted!'),
  onError: (errors) => console.error(errors),
  onFinish: () => setLoading(false),
});

// Delete with confirmation
function handleDelete(id: number) {
  if (!confirm('Delete this listing?')) return;
  router.delete(route('listings.destroy', id), {
    onSuccess: () => toast.success('Deleted'),
  });
}
```

---

## `<Link>` — Navigation Component

```tsx
import { Link } from '@inertiajs/react';

// Basic link
<Link href={route('listings.index')}>Browse</Link>

// With method (for non-GET)
<Link href={route('offers.destroy', offerId)} method="delete" as="button">
  Cancel Offer
</Link>

// Preserve scroll position
<Link href={route('listings.index', { page: 2 })} preserveScroll>
  Next Page
</Link>

// Only reload specific props (partial reload)
<Link href={route('listings.index')} only={['listings']}>
  Refresh Listings
</Link>
```

---

## Deferred Props + `WhenVisible`

Deferred props allow heavy data to load after the initial page render:

```tsx
// Laravel controller:
// return Inertia::render('Dashboard', [
//   'stats' => Inertia::defer(fn() => $this->computeExpensiveStats()),
//   'recentDeals' => Inertia::defer(fn() => Deal::recent()->get()),
// ]);

// React page component:
import { WhenVisible } from '@inertiajs/react';
import type { DeferredData } from '@inertiajs/react';

interface Props {
  stats: DeferredData<DashboardStats>;
  recentDeals: DeferredData<Deal[]>;
}

export default function Dashboard({ stats, recentDeals }: Props) {
  return (
    <div>
      {/* Renders skeleton until stats loads */}
      <WhenVisible data="stats" fallback={<StatsSkeleton />}>
        <StatsPanel stats={stats as DashboardStats} />
      </WhenVisible>

      {/* Multiple deferred props */}
      <WhenVisible data={['stats', 'recentDeals']} fallback={<Spinner />}>
        <SummaryWidget stats={stats as DashboardStats} deals={recentDeals as Deal[]} />
      </WhenVisible>
    </div>
  );
}
```

---

## Partial Reloads

```tsx
// Only fetch specific props from server — great for filters/pagination
function handlePageChange(page: number) {
  router.visit(route('listings.index'), {
    data: { ...filters, page },
    only: ['listings'],       // server only computes 'listings' prop
    preserveState: true,      // keep filter form state
    preserveScroll: true,
  });
}

// Polling (auto-refresh)
useEffect(() => {
  const interval = setInterval(() => {
    router.reload({ only: ['notifications'] });
  }, 30_000);
  return () => clearInterval(interval);
}, []);
```

---

## Inertia Event Listeners

```tsx
import { router } from '@inertiajs/react';
import { useEffect } from 'react';

// Show global loading indicator
useEffect(() => {
  const removeStart = router.on('start', () => setLoading(true));
  const removeFinish = router.on('finish', () => setLoading(false));

  return () => {
    removeStart();
    removeFinish();
  };
}, []);
```

---

## Type Helpers

```tsx
// types/inertia.ts
import type { Page } from '@inertiajs/react';

// Augment PageProps for shared data
declare module '@inertiajs/react' {
  interface PageProps {
    auth: { user: User | null };
    flash: { success?: string; error?: string };
  }
}

// Paginated response type
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: { url: string | null; label: string; active: boolean }[];
}
```
