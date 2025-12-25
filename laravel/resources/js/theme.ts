import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4F46E5', // Indigo 600 - matching the existing Tailwind vibe
        },
        secondary: {
            main: '#F97316', // Orange 500 - matching accents
        },
        background: {
            default: '#F9FAFB', // gray-50
            paper: '#FFFFFF',
        },
        text: {
            primary: '#111827', // gray-900
            secondary: '#6B7280', // gray-500
        }
    },
    typography: {
        fontFamily: '"Figtree", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '0.5rem',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: '1rem',
                },
            },
        },
    },
});

export default theme;
