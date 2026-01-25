import { createTheme } from '@mui/material/styles';

const colors = {
    maroon: '#572a4d',
    charcoal: '#2c233e',
    slate: '#6A7282',
    tan: '#d07669',
    white: '#ffffff',
    cloud: '#F9FAFB',
    border: '#E5E7EB',
    rosyPink: '#CB9A9F',
};

declare module '@mui/material/styles' {
    interface TypeBackground {
        sidebar?: string;
        white?: string;
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

    interface ShapeOptions {
        borderRadius?: number | string;
        padding?: string | number;
        boxShadow?: string;
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: colors.maroon,
        },
        secondary: {
            main: colors.charcoal,
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
            sidebar: colors.charcoal,
            white: colors.white,
        },

    },
    shape: {
        borderRadius: '16px',
        padding: '25px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)',
    },
    components: {
        // --- GLOBAL TEXTFIELD / INPUT OVERRIDES ---
        MuiTextField: {
            defaultProps: {
                // This ensures all TextFields use the outlined variant by default
                variant: 'outlined',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.white,
                    borderRadius: '14px', // Matches your logo and card radius
                    transition: 'all 0.2s ease-in-out',

                    // Border styling
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.border,
                        borderWidth: '1.5px', // Slightly thicker for a premium feel
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.rosyPink, // Subtle brand color on hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.maroon,
                        borderWidth: '2px',
                    },
                    // Error state
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ef4444',
                    }
                },
                input: {
                    padding: '14px 16px', // Matches your "john.doe" screenshot padding
                    fontWeight: 400,
                    fontSize: '16px',
                    color: colors.slate,
                    '&::placeholder': {
                        color: colors.slate,
                        opacity: 0.8,
                        fontWeight: 400,
                    },
                },
            },
        },
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
                    borderRadius: '12px',
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
    },
});

export default theme;
