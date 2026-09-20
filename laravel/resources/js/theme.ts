import { createTheme } from '@mui/material/styles';
import tokens from './design/tokens';

const { primary, neutral, accent, success, warning, error, info, radius, blur, glassFill, glassFillDark, rim, elevation, motion, typography } = tokens;

// Legacy key names are kept so existing call sites (theme.colors.*) keep working;
// values now resolve to the "Liquid Glass" token ramps in design/tokens.ts.
const colors = {
    maroon: primary[600],
    charcoal: neutral[800],
    slate: neutral[600],
    tan: accent[400],
    white: neutral[0],
    cloud: neutral[50],
    border: neutral[200],
    rosyPink: accent[300],
    success: success[600],
    error: error[600],
    warning: warning[600],
    info: info[600],
    gradient: `linear-gradient(135deg, ${primary[50]} 0%, ${neutral[0]} 60%, ${accent[50]} 100%)`,
};

type AppColors = typeof colors;

type AppGlass = {
    blur: typeof blur;
    fill: typeof glassFill & { dark: typeof glassFillDark };
    rim: string;
    elevation: typeof elevation;
    motion: typeof motion;
};

const glass: AppGlass = {
    blur,
    fill: { ...glassFill, dark: glassFillDark },
    rim,
    elevation,
    motion,
};

declare module '@mui/material/styles' {
    interface Theme {
        colors: AppColors;
        glass: AppGlass;
    }
    interface ThemeOptions {
        colors?: AppColors;
        glass?: AppGlass;
    }
    interface TypeBackground {
        sidebar?: string;
        white?: string;
        gradient?: string;
    }
    interface TypeText {
        tan?: string;
        rosyPink?: string;
    }
    interface Shape {
        borderRadius: number | string;
        padding: string | number;
        boxShadow: string;
    }
    interface Palette {
        border: {
            main: string;
        };
    }
    interface PaletteOptions {
        border?: {
            main: string;
        };
    }
    interface ShapeOptions {
        borderRadius?: number | string;
        padding?: string | number;
        boxShadow?: string;
        border?: {
            main: string;
        };
    }
}

const theme = createTheme({
    colors,
    glass,
    typography: {
        fontFamily: typography.fontFamily,
        h1: { fontSize: typography.scale['5xl'], fontWeight: 700 },
        h2: { fontSize: typography.scale['4xl'], fontWeight: 700 },
        h3: { fontSize: typography.scale['3xl'], fontWeight: 700 },
        h4: { fontSize: typography.scale['2xl'], fontWeight: 600 },
        h5: { fontSize: typography.scale.xl, fontWeight: 600 },
        h6: { fontSize: typography.scale.lg, fontWeight: 600 },
        body1: { fontSize: typography.scale.body },
        body2: { fontSize: typography.scale.sm },
        caption: { fontSize: typography.scale.xs },
        button: { fontSize: typography.scale.sm, fontWeight: 600, textTransform: 'none' },
    },
    palette: {
        primary: {
            main: colors.maroon,
        },
        secondary: {
            main: colors.charcoal,
        },
        border: {
            main: colors.border,
        },
        text: {
            primary: colors.charcoal,
            secondary: colors.slate,
            tan: colors.tan,
            rosyPink: colors.rosyPink
        },
        background: {
            default: colors.cloud,
            paper: colors.white,
            sidebar: glass.fill.dark.level2,
            white: colors.white,
            gradient: colors.gradient,
        },
        success: {
            main: colors.success,
            contrastText: neutral[0],
        },
        error: {
            main: colors.error,
        },
        warning: {
            main: colors.warning,
            contrastText: neutral[0],
        },
        info: {
            main: colors.info,
        },

    },
    shape: {
        borderRadius: radius.lg,
        padding: '25px',
        boxShadow: tokens.elevation.level2,
    },
    components: {
        // --- GLASS SURFACES (Paper/Card/Dialog/Menu/Popover/AppBar) ---
        // Emotion-generated styleOverrides bypass PostCSS/autoprefixer, so every
        // backdropFilter here is paired by hand with WebkitBackdropFilter for Safari.
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: glassFill.level2,
                    backdropFilter: blur.md,
                    WebkitBackdropFilter: blur.md,
                    borderRadius: radius.lg,
                    boxShadow: elevation.level2,
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: glassFill.level1,
                    backdropFilter: blur.sm,
                    WebkitBackdropFilter: blur.sm,
                    borderRadius: radius.lg,
                    boxShadow: elevation.level1,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                    backgroundColor: glassFill.level3,
                    backdropFilter: blur.lg,
                    WebkitBackdropFilter: blur.lg,
                    borderRadius: radius.xl,
                    // Dialog's paper is itself a Paper, so the MuiPaper boxShadow/border
                    // above would otherwise stack with this one — reset before reapplying.
                    boxShadow: elevation.level3,
                    border: 'none',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                    backgroundColor: glassFill.level2,
                    backdropFilter: blur.md,
                    WebkitBackdropFilter: blur.md,
                    borderRadius: radius.lg,
                    boxShadow: elevation.level2,
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                    backgroundColor: glassFill.level2,
                    backdropFilter: blur.md,
                    WebkitBackdropFilter: blur.md,
                    borderRadius: radius.lg,
                    boxShadow: elevation.level2,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: glassFill.level1,
                    backdropFilter: blur.md,
                    WebkitBackdropFilter: blur.md,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: radius.pill,
                },
            },
        },
        // --- GLOBAL TEXTFIELD / INPUT OVERRIDES ---
        MuiTextField: {
            defaultProps: {
                // This ensures all TextFields use the outlined variant by default
                variant: 'outlined',
            },
        },
        // MuiOutlinedInput: {
        //     styleOverrides: {
        //         root: {
        //             backgroundColor: colors.white,
        //             borderRadius: '14px', // Matches your logo and card radius
        //             transition: 'all 0.2s ease-in-out',
        //
        //             // Border styling
        //             '& .MuiOutlinedInput-notchedOutline': {
        //                 borderColor: colors.border,
        //                 borderWidth: '1.5px', // Slightly thicker for a premium feel
        //             },
        //             '&:hover .MuiOutlinedInput-notchedOutline': {
        //                 borderColor: colors.rosyPink, // Subtle brand color on hover
        //             },
        //             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        //                 borderColor: colors.maroon,
        //                 borderWidth: '2px',
        //             },
        //             // Error state
        //             '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        //                 borderColor: '#ef4444',
        //             }
        //         },
        //         input: {
        //             padding: '14px 16px', // Matches your "john.doe" screenshot padding
        //             fontWeight: 400,
        //             fontSize: '16px',
        //             color: colors.slate,
        //             '&::placeholder': {
        //                 color: colors.slate,
        //                 opacity: 0.8,
        //                 fontWeight: 400,
        //             },
        //         },
        //     },
        // },
        // --- INPUT ADORNMENTS (Icons inside inputs) ---
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    color: colors.slate, // Standardizes icon color inside inputs
                },
            },
        },
        // --- BUTTONS ---
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: radius.md,
                    padding: '12px 24px',
                    fontWeight: 600,
                },
                // containedPrimary: {
                //     backgroundColor: colors.maroon,
                //     '&:hover': {
                //         backgroundColor: '#43203b', // Darker shade of maroon
                //     }
                // }
            },
        },
        // --- GLOBAL LINK STYLING ---
        MuiLink: {
            defaultProps: {
                underline: 'none', // Removes the underline globally
            },
            styleOverrides: {
                root: {
                    color: colors.maroon, // Uses your brand maroon
                    fontWeight: 600,
                    transition: 'color 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        color: colors.rosyPink, // Changes color on hover
                        textDecoration: 'none',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: neutral[500], // subtle gray for default state
                    fontSize: '0.9rem',
                    // When the input is focused
                    '&.Mui-focused': {
                        color: primary[600], // use primary color
                        fontWeight: 500,
                    },
                    // When there is an error
                    '&.Mui-error': {
                        color: error[600],
                    },
                },
            },
        },

        // 2. Style the actual input field (TextField, Select, etc.)
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: radius.md, // Match your app's border radius
                    backgroundColor: neutral[0], // Clean white background
                    transition: 'all 0.2s ease-in-out',

                    // Default border
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: neutral[200],
                        borderWidth: '1px',
                    },

                    // Hover state border
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: neutral[300],
                    },

                    // Focused state border
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: primary[600], // primary color
                        borderWidth: '2px', // Make it pop
                    },

                    // Error state border
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: error[600], // Red border for errors
                    },
                },
                // Adjust padding for a slightly larger, modern click target
                input: {
                    padding: '14px 14px',
                },
            },
        },

        // 3. Specific adjustments for Select dropdowns
        MuiSelect: {
            styleOverrides: {
                select: {
                    padding: '14px 14px', // Match OutlinedInput padding
                    display: 'flex',
                    alignItems: 'center',
                },
            },
        },

        // 4. Style the helper/error text below the input
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginLeft: 4, // Align better with the left edge of the input
                    marginTop: 4,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    '&.Mui-error': {
                        color: error[600],
                    },
                },
            },
        },

        // 5. Style the dropdown menu items
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: radius.xs,
                    margin: '4px 8px', // Float the items slightly off the edges
                    padding: '8px 16px',
                    '&.Mui-selected': {
                        backgroundColor: primary[50], // Primary with opacity
                        color: primary[600],
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: primary[100],
                        },
                    },
                },
            },
        },
    },
});

export default theme;
