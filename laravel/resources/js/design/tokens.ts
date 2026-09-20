/**
 * Design token source of truth for the "Liquid Glass" light theme.
 *
 * Mirrored 1:1 as CSS custom properties in `resources/scss/abstracts/_tokens.scss`.
 * `resources/js/theme.ts` and every glass primitive read from this file only —
 * never hardcode a hex/px value that already exists here.
 */

export type ColorRamp = {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
};

export type SemanticRamp = {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
};

/** Brand accent — "Iris". Primary actions, focus rings, links. */
export const primary: ColorRamp = {
    50: '#EEF1FD',
    100: '#DDE3FB',
    200: '#B9C4F6',
    300: '#93A3F0',
    400: '#6C82E8',
    500: '#4C64DF',
    600: '#3B5BDB',
    700: '#2F47B0',
    800: '#253884',
    900: '#1C2A63',
};

/** Cool-neutral "Slate" ramp — text, borders, surfaces. */
export const neutral: ColorRamp & { 0: string } = {
    0: '#FFFFFF',
    50: '#F8F9FC',
    100: '#F1F3F8',
    200: '#E4E7EF',
    300: '#D2D6E0',
    400: '#A9AFBF',
    500: '#7D8494',
    600: '#5B6272',
    700: '#434A5A',
    800: '#2B303D',
    900: '#171A22',
};

/** Warm accent — "Terracotta". Used sparingly: prices, highlights, secondary CTAs. */
export const accent: ColorRamp = {
    50: '#FBEEE7',
    100: '#F6D9C8',
    200: '#ECB595',
    300: '#E08F62',
    400: '#CE6D3D',
    500: '#BD5C30',
    600: '#B34F2A',
    700: '#8F3E22',
    800: '#6C2F1A',
    900: '#4A2012',
};

export const success: SemanticRamp = { 50: '#E7F6EE', 100: '#C7EBD8', 500: '#22A06B', 600: '#197A4E', 700: '#136540' };
export const warning: SemanticRamp = { 50: '#FDF3E7', 100: '#F9E0BF', 500: '#C9740A', 600: '#B45309', 700: '#8F4207' };
export const error: SemanticRamp = { 50: '#FBEAE9', 100: '#F5CBC8', 500: '#D5352B', 600: '#C6291F', 700: '#9E2019' };
export const info: SemanticRamp = { 50: '#E8F2FA', 100: '#C6E2F4', 500: '#1481C4', 600: '#0B6FB8', 700: '#0A5A94' };

/** Semantic roles — the only palette values components should reference directly. */
export const semantic = {
    textPrimary: neutral[800],
    textSecondary: neutral[600],
    textMuted: neutral[500],
    textOnPrimary: neutral[0],
    textDisabled: neutral[400],
    border: neutral[200],
    borderStrong: neutral[300],
    surface: neutral[0],
    surfaceSunken: neutral[50],
    backgroundBase: neutral[50],
    primary: primary[600],
    primaryHover: primary[700],
    primaryMuted: primary[50],
    accent: accent[600],
    accentMuted: accent[50],
    success: success[600],
    successMuted: success[50],
    warning: warning[600],
    warningMuted: warning[50],
    error: error[600],
    errorMuted: error[50],
    info: info[600],
    infoMuted: info[50],
} as const;

/** 8px base spacing scale, exposed for SCSS/non-MUI consumers. MUI theme.spacing() uses the same 8px factor. */
export const spacing = {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
} as const;

/** 4-step radius scale per the "Liquid Glass" direction: cards >=20px, controls 12-14px, pills full. */
export const radius = {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '20px',
    xl: '28px',
    pill: '9999px',
} as const;

export const blur = {
    sm: 'blur(16px) saturate(180%)',
    md: 'blur(24px) saturate(180%)',
    lg: 'blur(32px) saturate(180%)',
} as const;

/** Glass surface fill opacity per elevation. Higher elevation = more opaque for legibility. */
export const glassFill = {
    level1: 'rgba(255, 255, 255, 0.78)',
    level2: 'rgba(255, 255, 255, 0.66)',
    level3: 'rgba(255, 255, 255, 0.82)',
} as const;

/** Dark glass fill for surfaces on a dark base (sidebar). Derived from neutral[800]/[900]. */
export const glassFillDark = {
    level2: 'rgba(43, 48, 61, 0.80)',
} as const;

/** Hairline "glass rim" — light top edge + subtle dark bottom edge, layered onto elevation shadows. */
export const rim = 'inset 0 1px 0 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 0 rgba(23, 26, 34, 0.05)';

/** Soft multi-layer (ambient + contact) shadows. Never a single harsh drop shadow. */
export const elevation = {
    level1: `0 1px 2px 0 rgba(23, 26, 34, 0.04), 0 1px 1px 0 rgba(23, 26, 34, 0.03), ${rim}`,
    level2: `0 8px 24px -4px rgba(23, 26, 34, 0.10), 0 2px 8px -2px rgba(23, 26, 34, 0.06), ${rim}`,
    level3: `0 24px 48px -12px rgba(23, 26, 34, 0.18), 0 8px 16px -6px rgba(23, 26, 34, 0.08), ${rim}`,
} as const;

export const motion = {
    duration: {
        fast: 150,
        base: 250,
        slow: 400,
    },
    easing: {
        standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    },
} as const;

export const zIndex = {
    ambient: -1,
    base: 0,
    sticky: 10,
    dropdown: 1000,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    toast: 1400,
    tooltip: 1500,
} as const;

export const typography = {
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    /** 1.20 minor-third modular scale. */
    scale: {
        xs: '0.694rem',
        sm: '0.833rem',
        body: '1rem',
        lg: '1.2rem',
        xl: '1.44rem',
        '2xl': '1.728rem',
        '3xl': '2.074rem',
        '4xl': '2.488rem',
        '5xl': '2.986rem',
    },
} as const;

export const tokens = {
    primary,
    neutral,
    accent,
    success,
    warning,
    error,
    info,
    semantic,
    spacing,
    radius,
    blur,
    glassFill,
    glassFillDark,
    rim,
    elevation,
    motion,
    zIndex,
    typography,
} as const;

export default tokens;
