# TypeScript for React Reference

> Load when: TypeScript generics, utility types, discriminated unions,
> satisfies operator, strict mode patterns, typing React props

---

## Project tsconfig (strict mode)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "jsx": "react-jsx",       // no React import needed for JSX
    "baseUrl": ".",
    "paths": { "@/*": ["resources/js/*"] }
  }
}
```

---

## Component Prop Typing Patterns

### Basic Props

```tsx
// ✅ Explicit interface, no React.FC
interface UserCardProps {
  user: User;
  isSelected?: boolean;
  onSelect: (id: number) => void;
}

export function UserCard({ user, isSelected = false, onSelect }: UserCardProps) {}
```

### Generic Components

```tsx
// Generic list that works with any item type
interface SelectListProps<T> {
  items: T[];
  selected: T | null;
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
  onChange: (item: T) => void;
}

export function SelectList<T>({
  items, selected, getLabel, getValue, onChange,
}: SelectListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li
          key={getValue(item)}
          onClick={() => onChange(item)}
          aria-selected={item === selected}
        >
          {getLabel(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage — TypeScript infers T = User
<SelectList<User>
  items={users}
  selected={selectedUser}
  getLabel={u => u.name}
  getValue={u => u.id}
  onChange={setSelectedUser}
/>
```

### Children Typing

```tsx
// ReactNode — anything renderable
interface CardProps { children: React.ReactNode; className?: string; }

// ReactElement — only React elements (not strings/numbers)
interface WrapperProps { children: React.ReactElement; }

// Specific children via generics (rare, prefer ReactNode)
```

---

## `satisfies` Operator (TS 4.9+)

```tsx
// satisfies validates type without widening
// Great for config objects and route definitions

const routes = {
  home: '/',
  listings: '/listings',
  dashboard: '/dashboard',
} satisfies Record<string, string>;

// routes.home is type string (not widened to string | undefined)
// routes.nonexistent — TypeScript error ✅

// Typing event handler options
const formConfig = {
  method: 'post',
  preserveState: true,
} satisfies Parameters<typeof router.visit>[1];
```

---

## Discriminated Unions

```tsx
// Model domain states as discriminated unions
type DealStatus =
  | { status: 'pending'; offer: Offer }
  | { status: 'deposit_due'; offer: Offer; depositAmount: number }
  | { status: 'condition_day'; conditionDate: Date }
  | { status: 'completed'; possessionDate: Date }
  | { status: 'cancelled'; reason: string };

function DealStatusBadge({ deal }: { deal: DealStatus }) {
  switch (deal.status) {
    case 'pending':
      return <Badge color="gray">Pending offer</Badge>;
    case 'deposit_due':
      // TypeScript knows deal.depositAmount exists here
      return <Badge color="yellow">Deposit due: ${deal.depositAmount}</Badge>;
    case 'completed':
      return <Badge color="green">Completed {deal.possessionDate.toLocaleDateString()}</Badge>;
    case 'cancelled':
      return <Badge color="red">Cancelled: {deal.reason}</Badge>;
  }
}

// Async state union
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

---

## Utility Types in Practice

```tsx
// Pick — select subset of props
type ListingPreview = Pick<RealEstateListing, 'id' | 'title' | 'price' | 'address'>;

// Omit — remove props
type CreateListingInput = Omit<RealEstateListing, 'id' | 'created_at' | 'updated_at'>;

// Partial — all props optional (for update forms)
type UpdateListingInput = Partial<CreateListingInput>;

// Required — all props required
type CompleteUser = Required<User>;

// Readonly — immutable object
type ImmutableConfig = Readonly<AppConfig>;

// Record — typed map
type RolePermissions = Record<'buyer' | 'seller' | 'lawyer' | 'admin', string[]>;

// ReturnType — infer function return type
type UseFormReturn = ReturnType<typeof useForm>;

// Parameters — infer function parameters
type RouterVisitOptions = Parameters<typeof router.visit>[1];

// NonNullable — remove null/undefined
type UserId = NonNullable<User['id']>; // removes undefined if optional
```

---

## Type Guards

```tsx
// User-defined type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// Narrowing with discriminated union
function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

// Usage in exhaustive switch
function handleStatus(status: DealStatus): string {
  switch (status.status) {
    case 'pending': return 'Pending';
    case 'deposit_due': return 'Deposit Due';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    case 'condition_day': return 'Condition Day';
    default: return assertNever(status); // TypeScript error if case missed
  }
}
```

---

## Event Handler Types

```tsx
// Input events
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);
}

// Form submit
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

// Button click
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.stopPropagation();
}

// Select change
function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
  setSelected(e.target.value);
}

// Keyboard
function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === 'Enter') submit();
}
```

---

## `as const` — Literal Types

```tsx
// Without as const — type is string[]
const ROLES = ['buyer', 'seller', 'lawyer', 'admin'];

// With as const — type is readonly ['buyer', 'seller', 'lawyer', 'admin']
const ROLES = ['buyer', 'seller', 'lawyer', 'admin'] as const;
type Role = typeof ROLES[number]; // 'buyer' | 'seller' | 'lawyer' | 'admin'

// Object literal types
const DEAL_STATUSES = {
  PENDING: 'pending',
  DEPOSIT: 'deposit_due',
  COMPLETED: 'completed',
} as const;
type DealStatusCode = typeof DEAL_STATUSES[keyof typeof DEAL_STATUSES];
```

---

## Common Anti-Patterns

```tsx
// ❌ any — loses all type safety
function process(data: any) { return data.something; }
// ✅ unknown + type guard
function process(data: unknown) {
  if (isUser(data)) return data.name;
}

// ❌ Type assertion without validation
const user = response as User; // runtime could fail
// ✅ Parse/validate at boundary
const user = UserSchema.parse(response); // Zod or manual guard

// ❌ Optional chaining spam hides bugs
const name = user?.profile?.address?.city?.name;
// ✅ Make required data required in types

// ❌ React.FC — hides return type issues
const Card: React.FC<CardProps> = ({ title }) => <div>{title}</div>;
// ✅ Explicit return
function Card({ title }: CardProps): JSX.Element {
  return <div>{title}</div>;
}
```
