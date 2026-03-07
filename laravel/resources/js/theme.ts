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
    success: '#00C851',
    error: '#EF4444',
    warning: '#FFAB00',
    info: '#3B82F6',
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
            sidebar: colors.charcoal,
            white: colors.white,
        },
        success: {
            main: colors.success,
            contrastText: '#ffffff',
        },
        error: {
            main: colors.error,
        },
        warning: {
            main: colors.warning,
            contrastText: '#ffffff',
        },
        info: {
            main: colors.info,
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
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#64748B', // subtle gray for default state
                    fontSize: '0.9rem',
                    // When the input is focused
                    '&.Mui-focused': {
                        color: '#572A4D', // use primary color
                        fontWeight: 500,
                    },
                    // When there is an error
                    '&.Mui-error': {
                        color: '#DC2626', // red
                    },
                },
            },
        },

        // 2. Style the actual input field (TextField, Select, etc.)
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Match your app's border radius
                    backgroundColor: '#FFFFFF', // Clean white background
                    transition: 'all 0.2s ease-in-out',

                    // Default border
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E2E8F0',
                        borderWidth: '1px',
                    },

                    // Hover state border
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#CBD5E1',
                    },

                    // Focused state border
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#572A4D', // primary color
                        borderWidth: '2px', // Make it pop
                    },

                    // Error state border
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#DC2626', // Red border for errors
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
                        color: '#DC2626',
                    },
                },
            },
        },

        // 5. Style the dropdown menu items
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    margin: '4px 8px', // Float the items slightly off the edges
                    padding: '8px 16px',
                    '&.Mui-selected': {
                        backgroundColor: '#572A4D1A', // Primary with opacity
                        color: '#572A4D',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: '#572A4D2A',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
