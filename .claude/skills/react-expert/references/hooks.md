# React Hooks Reference

> Load when: useState, useEffect, useCallback, useMemo, useRef, custom hooks,
> React 19 hooks (use, useOptimistic, useFormStatus, useTransition, useId)

---

## React 19 New Hooks

### `use()` — Unwrap Promises and Context

```tsx
import { use, Suspense } from 'react';

// Unwrap a promise (replaces useEffect + useState for async data)
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // suspends until resolved
  return <div>{user.name}</div>;
}

// Wrap in Suspense
function Page() {
  const userPromise = fetchUser(1); // stable reference!
  return (
    <Suspense fallback={<Skeleton />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

// Unwrap Context (can be called conditionally, unlike useContext)
function ThemeButton() {
  const theme = use(ThemeContext);
  return <button style={{ color: theme.primary }}>Click</button>;
}
```

### `useOptimistic` — Optimistic UI Updates

```tsx
import { useOptimistic, useTransition } from 'react';

interface Message { id: number; text: string; sending?: boolean; }

function MessageList({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      { id: Date.now(), text: newMessage, sending: true },
    ]
  );

  const [isPending, startTransition] = useTransition();

  function handleSend(text: string) {
    startTransition(async () => {
      addOptimistic(text);
      await sendMessage(text); // actual API call
    });
  }

  return (
    <>
      {optimisticMessages.map(m => (
        <div key={m.id} style={{ opacity: m.sending ? 0.6 : 1 }}>
          {m.text}
        </div>
      ))}
    </>
  );
}
```

### `useFormStatus` — Form Submission State

```tsx
import { useFormStatus } from 'react-dom';

// Must be used in a component INSIDE a <form>
function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

function ContactForm() {
  return (
    <form action={handleSubmit}>
      <input name="email" type="email" />
      <SubmitButton /> {/* useFormStatus works here */}
    </form>
  );
}
```

### `useTransition` — Non-Blocking State Updates

```tsx
import { useState, useTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(value: string) {
    setQuery(value); // urgent — update input immediately

    startTransition(() => {
      // non-urgent — can be interrupted
      setResults(filterResults(value));
    });
  }

  return (
    <>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      {isPending ? <Spinner /> : <ResultList results={results} />}
    </>
  );
}
```

---

## Core Hooks Patterns

### `useState` — Correct Patterns

```tsx
// ✅ Functional update for state that depends on previous value
setCount(prev => prev + 1);

// ✅ Lazy initializer for expensive computation (runs once)
const [state, setState] = useState(() => computeExpensiveInitialState());

// ✅ Object state — always spread to avoid mutation
const [user, setUser] = useState<User>({ name: '', email: '' });
setUser(prev => ({ ...prev, name: 'John' }));

// ❌ Never mutate state directly
user.name = 'John'; // WRONG
setState(user);     // WRONG — same reference, no re-render
```

### `useEffect` — Correct Patterns

```tsx
// ✅ Data fetching with cleanup
useEffect(() => {
  let cancelled = false;

  async function load() {
    const data = await fetchUser(userId);
    if (!cancelled) setUser(data);
  }

  load();
  return () => { cancelled = true; };
}, [userId]); // re-runs when userId changes

// ✅ Event listener with cleanup
useEffect(() => {
  function handleResize() { setWidth(window.innerWidth); }
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []); // empty array = run once on mount

// ❌ Don't use useEffect to sync derived state
// BAD:
useEffect(() => { setFullName(`${first} ${last}`); }, [first, last]);
// GOOD:
const fullName = `${first} ${last}`; // just derive it
```

### `useCallback` — When to Use

```tsx
// ✅ Use when passing callbacks to memoized children
const handleSubmit = useCallback((data: FormData) => {
  onSubmit(data);
}, [onSubmit]);

// ✅ Use when callback is a useEffect dependency
useEffect(() => {
  const result = compute(value);
  onResult(result);
}, [value, onResult]); // onResult must be stable → wrap in useCallback at callsite

// ❌ Don't useCallback for everything — only when it matters
// These are fine without useCallback (local handlers, non-memoized children):
function handleClick() { setOpen(true); }
```

### `useMemo` — When to Use

```tsx
// ✅ Expensive computation
const sortedList = useMemo(() =>
  [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// ✅ Referentially stable object passed to memoized child
const config = useMemo(() => ({ apiUrl, timeout }), [apiUrl, timeout]);

// ❌ Don't memoize cheap operations
const doubled = useMemo(() => count * 2, [count]); // pointless
const doubled = count * 2; // just do this
```

### `useRef` — Patterns

```tsx
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);
useEffect(() => { inputRef.current?.focus(); }, []);

// Mutable value that doesn't trigger re-render
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
function startTimer() {
  timerRef.current = setTimeout(() => doSomething(), 1000);
}
function stopTimer() {
  if (timerRef.current) clearTimeout(timerRef.current);
}

// Previous value pattern
function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current; // returns value from previous render
}
```

### `useId` — Accessibility IDs

```tsx
// ✅ Generates stable, unique IDs for SSR-compatible accessibility
function TextField({ label }: { label: string }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}
// Don't use for list keys — use useId only for DOM IDs
```

---

## Custom Hooks

### Structure Pattern

```tsx
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value: T | ((prev: T) => T)) {
    const newValue = value instanceof Function ? value(storedValue) : value;
    setStoredValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [storedValue, setValue] as const;
}
```

### Async Data Fetching Hook

```tsx
// hooks/useAsync.ts
import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>(asyncFn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null, error: null, isLoading: true,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await asyncFn();
      setState({ data, error: null, isLoading: false });
    } catch (err) {
      setState({ data: null, error: err as Error, isLoading: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { ...state, refetch: execute };
}
```

### Debounce Hook

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) search(debouncedQuery);
  }, [debouncedQuery]);
}
```

---

## Quick Reference

| Hook | Use Case |
|---|---|
| `useState` | Local component state |
| `useEffect` | Side effects, subscriptions, data fetching |
| `useCallback` | Stable function reference for memoized children |
| `useMemo` | Expensive computations, stable object references |
| `useRef` | DOM refs, mutable values without re-render |
| `useId` | Unique IDs for accessibility |
| `useContext` | Read context value |
| `useReducer` | Complex state with multiple sub-values |
| `useTransition` | Mark updates as non-urgent |
| `useOptimistic` | Optimistic UI updates |
| `useFormStatus` | Form submission state (inside `<form>`) |
| `use()` | Unwrap Promises/Context (React 19) |
