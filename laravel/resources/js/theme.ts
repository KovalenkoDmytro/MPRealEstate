import { createTheme } from '@mui/material/styles';

// Your Project Colors
const colors = {
    maroon: '#572a4d',
    charcoal: '#2c233e',
    slate: '#6A7282',
    tan: '#d07669',
    white: '#ffffff',
    cloud: '#F9FAFB',
    border: '#E5E7EB', // Light grey for inputs
};

const theme = createTheme({
    // 1. Palette: Hooks up "primary" and "secondary" to your variables
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
        },
        background: {
            default: colors.cloud,
            paper: colors.white,
        },
    },

    // 2. Shape: Global border radius
    shape: {
        borderRadius: 8, // Matches your buttons and cards
    },

    // 3. Components: The Global Overrides
    components: {

        // --- INPUTS (TextField) ---
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.white,
                    transition: 'all 0.2s ease',

                    // Default Border
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.border,
                        borderWidth: '1px',
                    },

                    // Hover State
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.slate,
                    },

                    // Focused State
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.maroon,
                        borderWidth: '2px',
                    },
                },
                input: {
                    padding: '12px 14px', // Comfortable padding
                    color: colors.charcoal,
                    fontWeight: 500,
                },
            },
        },

        // --- LABELS ---
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: colors.slate,
                    lineHeight: 1,
                    '&.Mui-focused': {
                        color: colors.maroon,
                        fontWeight: 600,
                        backgroundColor: colors.cloud,
                    },
                    '&.Mui-active': {
                        borderColor: colors.maroon,
                    },
                },
            },
        },

        // --- CHECKBOXES ---
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: colors.slate,
                    '&.Mui-checked': {
                        color: colors.maroon,
                    },
                },
            },
        },

        // --- BUTTONS ---
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Removes the default ALL CAPS
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    boxShadow: 'none',
                    padding: '10px 24px',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                },

            },
        },
    },
});

export default theme;
