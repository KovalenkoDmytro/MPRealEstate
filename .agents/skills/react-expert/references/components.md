# React Component Patterns

> Load when: component props, compound components, forwarded refs, render props,
> HOC, error boundaries, Suspense, React.memo, portals

---

## Component Fundamentals

### Props Interface Pattern

```tsx
// ✅ Explicit interface, named export, no React.FC
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  // Extend native element props when wrapping HTML
  className?: string;
}

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn('btn', `btn-${variant}`)}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <Spinner size="sm" /> : label}
    </button>
  );
}
```

### Extending Native HTML Element Props

```tsx
// ✅ Spread native props + add custom ones
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, ...rest }: InputProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={cn('input', error && 'input-error', className)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && <p id={`${id}-error`} role="alert">{error}</p>}
      {!error && helperText && <p>{helperText}</p>}
    </div>
  );
}
```

---

## Compound Components

```tsx
// Compound component pattern — keeps related components together
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = use(TabsContext); // React 19: use() works in conditions
  if (!ctx) throw new Error('Must be used within <Tabs>');
  return ctx;
}

interface TabsProps { defaultTab: string; children: React.ReactNode; }

export function Tabs({ defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  );
}

interface TabProps { value: string; children: React.ReactNode; }

Tabs.Tab = function Tab({ value, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ value, children }: TabProps) {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;
  return <div role="tabpanel">{children}</div>;
};

// Usage:
// <Tabs defaultTab="info">
//   <Tabs.Tab value="info">Info</Tabs.Tab>
//   <Tabs.Panel value="info"><InfoContent /></Tabs.Panel>
// </Tabs>
```

---

## Forwarded Refs

```tsx
// ✅ React 19: ref is now a regular prop, no forwardRef wrapper needed
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: React.Ref<HTMLInputElement>; // just add ref to props interface
}

export function TextField({ label, ref, ...props }: TextFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} ref={ref} {...props} />
    </div>
  );
}

// Usage — ref just works:
const inputRef = useRef<HTMLInputElement>(null);
<TextField label="Name" ref={inputRef} />
```

---

## Error Boundaries

```tsx
// Error boundaries still need class components (React limitation)
// Create once, use everywhere

interface ErrorBoundaryState { hasError: boolean; error: Error | null; }
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback?.(this.state.error, this.reset) ?? (
        <div>
          <p>Something went wrong.</p>
          <button onClick={this.reset}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage:
// <ErrorBoundary fallback={(err, reset) => <ErrorCard error={err} onRetry={reset} />}>
//   <RiskyComponent />
// </ErrorBoundary>
```

---

## React.memo — When to Use

```tsx
// ✅ Memoize when: parent re-renders frequently, component is expensive,
//    or receives stable callback/object props

interface UserRowProps {
  user: User;
  onSelect: (id: number) => void; // must be stable (useCallback at parent)
}

export const UserRow = React.memo(function UserRow({ user, onSelect }: UserRowProps) {
  return (
    <tr onClick={() => onSelect(user.id)}>
      <td>{user.name}</td>
      <td>{user.email}</td>
    </tr>
  );
});

// Parent uses useCallback to keep onSelect stable:
const handleSelect = useCallback((id: number) => {
  setSelectedId(id);
}, []); // no deps — function never changes
```

---

## Render Props Pattern

```tsx
// Render props — useful when rendering logic must stay outside
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyState?: React.ReactNode;
}

export function List<T>({ items, renderItem, keyExtractor, emptyState }: ListProps<T>) {
  if (items.length === 0) return <>{emptyState ?? <p>No items.</p>}</>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}

// Usage:
// <List
//   items={users}
//   keyExtractor={u => u.id.toString()}
//   renderItem={user => <UserCard user={user} />}
// />
```

---

## Suspense + Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const MapView = lazy(() => import('./MapView'));

function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={chartData} />
      </Suspense>

      <Suspense fallback={<MapSkeleton />}>
        <MapView coordinates={coords} />
      </Suspense>
    </div>
  );
}

// Skeleton component for loading state
function ChartSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 rounded h-64 w-full" />
  );
}
```

---

## Portals

```tsx
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

---

## Component Anti-Patterns to Avoid

```tsx
// ❌ Anonymous default export (hard to debug, no displayName)
export default () => <div>Bad</div>;

// ✅ Named function with named export
export function GoodComponent() { return <div>Good</div>; }

// ❌ Creating components inside render (new reference on each render)
function Parent() {
  const Child = () => <div>Inner</div>; // recreated on every render!
  return <Child />;
}

// ❌ Prop drilling 3+ levels deep — use Context or composition instead

// ❌ useEffect for derived state
useEffect(() => { setFullName(`${first} ${last}`); }, [first, last]);
// ✅ Just compute it:
const fullName = `${first} ${last}`;
```
