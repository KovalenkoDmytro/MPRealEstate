# State Management Reference

> Load when: Context API, useReducer, cross-component state,
> global state, notification context, auth context

---

## Context API — Full Pattern

```tsx
// context/AuthContext.tsx
import { createContext, use, useState, useCallback } from 'react';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

// Create context with null — consumers MUST be inside provider
const AuthContext = createContext<AuthContextValue | null>(null);

// Custom hook — enforces provider usage
export function useAuth() {
  const ctx = use(AuthContext); // React 19: use() works in conditions
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

// Provider component
interface AuthProviderProps { children: React.ReactNode; }

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: Credentials) => {
    const user = await authService.login(credentials);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext value={{
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }}>
      {children}
    </AuthContext>
  );
}
```

---

## Notification Context (this project's pattern)

```tsx
// context/NotificationContext.tsx — matches existing project pattern
import { createContext, use, useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextValue {
  notify: (message: string, type?: NotificationType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotification() {
  const ctx = use(NotificationContext);
  if (!ctx) throw new Error('Must be inside NotificationProvider');
  return ctx;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    // Uses react-toastify (project dependency)
    import('react-toastify').then(({ toast }) => {
      toast[type](message);
    });
  }, []);

  return (
    <NotificationContext value={{
      notify,
      success: (msg) => notify(msg, 'success'),
      error: (msg) => notify(msg, 'error'),
    }}>
      {children}
    </NotificationContext>
  );
}
```

---

## `useReducer` — Complex State

```tsx
// Use when: state has multiple sub-values, next state depends on previous,
// state transitions are explicit and testable

type ListingFilter = {
  search: string;
  minPrice: number | null;
  maxPrice: number | null;
  propertyType: string | null;
  sortBy: 'price_asc' | 'price_desc' | 'newest';
  page: number;
};

type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PRICE_RANGE'; min: number | null; max: number | null }
  | { type: 'SET_TYPE'; payload: string | null }
  | { type: 'SET_SORT'; payload: ListingFilter['sortBy'] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET' };

const initialFilter: ListingFilter = {
  search: '',
  minPrice: null,
  maxPrice: null,
  propertyType: null,
  sortBy: 'newest',
  page: 1,
};

function filterReducer(state: ListingFilter, action: FilterAction): ListingFilter {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_PRICE_RANGE':
      return { ...state, minPrice: action.min, maxPrice: action.max, page: 1 };
    case 'SET_TYPE':
      return { ...state, propertyType: action.payload, page: 1 };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET':
      return initialFilter;
  }
}

// Usage
function ListingsPage() {
  const [filter, dispatch] = useReducer(filterReducer, initialFilter);

  return (
    <>
      <input
        value={filter.search}
        onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
      />
      <button onClick={() => dispatch({ type: 'RESET' })}>Clear filters</button>
    </>
  );
}
```

---

## State Colocation Rules

Place state as close to where it's needed as possible:

```
1. Local state     → useState in the component
2. Sibling state   → Lift to common parent + pass as props
3. Page-wide state → Inertia page props (from server)
4. App-wide state  → Context API
```

```tsx
// ✅ Local state — modal open/close
function ListingCard({ listing }: { listing: Listing }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ...
}

// ✅ Lifted state — sibling components share filter
function FilteredListings() {
  const [filters, setFilters] = useState(defaultFilters);
  return (
    <>
      <FilterPanel filters={filters} onChange={setFilters} />
      <ListingGrid listings={filterListings(allListings, filters)} />
    </>
  );
}

// ✅ Context — current user, theme, notifications
// ✅ Inertia props — data from server (listings, deals, user profile)
```

---

## Derived State vs useEffect

```tsx
// ❌ Syncing state with useEffect
const [filteredItems, setFilteredItems] = useState(items);
useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]);

// ✅ Compute directly (or useMemo if expensive)
const filteredItems = items.filter(item => item.active);
// or:
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);
```

---

## State Initialization from Inertia Props

```tsx
// ✅ Initialize local state from Inertia props (runs once)
export default function EditListingPage({ listing }: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    title: listing.title,
    price: listing.price,
    description: listing.description,
    address: listing.address,
  });
  // Inertia useForm handles dirty state, processing, and errors
}

// ❌ Don't sync props → state with useEffect
useEffect(() => { setState(listing); }, [listing]); // bad
```
