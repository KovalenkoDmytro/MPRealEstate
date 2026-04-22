# Build Tooling & Performance Reference

> Load when: Vite config, lazy loading, Suspense, React.memo, code splitting,
> bundle optimization, performance profiling, MUI v7 integration

---

## Vite Configuration (project setup)

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true, // hot reload on Blade/PHP changes
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-inertia': ['@inertiajs/react'],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-maps': ['mapbox-gl', '@mapbox/search-js-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // KB
  },
});
```

---

## Code Splitting with `lazy` + `Suspense`

```tsx
// Lazy load heavy pages/components
import { lazy, Suspense } from 'react';

// Page-level splitting (Inertia resolves pages)
// In app.tsx — resolve pages lazily
const pages = import.meta.glob('./pages/**/*.tsx');

// Component-level splitting
const MapView = lazy(() => import('./components/maps/ListingLocationMap'));
const ImageGallery = lazy(() => import('./components/listing/ImageGallery'));
const DealTimeline = lazy(() => import('./components/deal/DealTimeline'));

// Skeleton fallbacks
function ListingDetail({ listing }: Props) {
  return (
    <div>
      <Suspense fallback={<ImageSkeleton />}>
        <ImageGallery images={listing.images} />
      </Suspense>

      <Suspense fallback={<MapSkeleton />}>
        <MapView lat={listing.lat} lng={listing.lng} />
      </Suspense>
    </div>
  );
}
```

---

## MUI v7 + React 19 Integration

### Theme Setup

```tsx
// theme.ts — project MUI theme
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
  components: {
    // Override component defaults globally
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none' }, // no ALL CAPS
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
  },
});

// app.tsx — wrap with ThemeProvider
import { ThemeProvider, CssBaseline } from '@mui/material';

createInertiaApp({
  setup({ el, App, props }) {
    createRoot(el).render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App {...props} />
      </ThemeProvider>
    );
  },
});
```

### MUI Component Patterns

```tsx
// ✅ Use sx prop for one-off overrides
<Box sx={{ display: 'flex', gap: 2, p: 3 }}>

// ✅ Use styled() for reusable styled components
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  '&:hover': { boxShadow: theme.shadows[4] },
}));

// ✅ MUI DatePicker with date-fns adapter (project uses date-fns)
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function AppointmentForm() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Appointment Date"
        value={date}
        onChange={setDate}
        disablePast
      />
    </LocalizationProvider>
  );
}

// ✅ MUI + Inertia form errors
<TextField
  label="Price"
  value={data.price}
  onChange={e => setData('price', e.target.value)}
  error={!!errors.price}
  helperText={errors.price}
/>
```

---

## Performance Optimization

### When to Memoize

```tsx
// Profile FIRST — don't guess. Use React DevTools Profiler.

// ✅ Memoize expensive list rendering
const SortedListings = React.memo(function SortedListings({
  listings,
  onSelect,
}: {
  listings: Listing[];
  onSelect: (id: number) => void; // must be stable!
}) {
  return <ul>{listings.map(l => <ListingRow key={l.id} listing={l} onSelect={onSelect} />)}</ul>;
});

// Parent keeps callback stable:
const handleSelect = useCallback((id: number) => setSelected(id), []);

// ✅ useMemo for expensive sort/filter
const filteredAndSorted = useMemo(() => {
  return listings
    .filter(l => l.price >= minPrice && l.price <= maxPrice)
    .sort((a, b) => b.price - a.price);
}, [listings, minPrice, maxPrice]);
```

### Avoid Common Re-render Traps

```tsx
// ❌ Inline object prop — new reference on every render
<Component style={{ color: 'red' }} />

// ✅ Extract outside component or use useMemo
const style = { color: 'red' }; // outside component
<Component style={style} />

// ❌ Inline function prop to memo component
<MemoizedChild onChange={value => setState(value)} />

// ✅ useCallback
const handleChange = useCallback((value: string) => setState(value), []);
<MemoizedChild onChange={handleChange} />

// ❌ Context with large objects causes all consumers to re-render
const ctx = { user, settings, notifications, ... }; // all in one context

// ✅ Split contexts by update frequency
<AuthContext.Provider value={{ user }}>         {/* rarely changes */}
  <ThemeContext.Provider value={{ theme }}>     {/* rarely changes */}
    <NotificationContext.Provider value={...}>  {/* changes often */}
```

---

## Bundle Analysis

```bash
# Check bundle size
npm run build
# Look at dist/ for chunk sizes

# Analyze with rollup-plugin-visualizer (add to vite.config.ts if needed)
# npm install --save-dev rollup-plugin-visualizer
```

```ts
// vite.config.ts — add temporarily for analysis
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  // ...existing plugins
  visualizer({ open: true, gzipSize: true }),
]
```

---

## Image Optimization

```tsx
// Use loading="lazy" for below-fold images
<img src={listing.thumbnail} loading="lazy" alt={listing.title} />

// Use Swiper for galleries (already in project)
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

function ImageGallery({ images }: { images: ListingImage[] }) {
  return (
    <Swiper spaceBetween={10} slidesPerView={1}>
      {images.map(img => (
        <SwiperSlide key={img.id}>
          <img src={img.url} alt={img.alt ?? ''} loading="lazy" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

---

## React DevTools Tips

- **Profiler tab**: Record interactions to find which components re-render
- **Highlight updates**: Settings → "Highlight updates when components render"
- **Components tab**: Inspect props, state, context values at runtime
- Look for components that render when they shouldn't — grey out with `React.memo`
