import { createTheme } from '@mui/material';

export const appointmentTheme = createTheme({
    palette: {
        primary: { main: '#4F46E5' }, // Indigo
        background: { paper: '#ffffff', default: '#F9FAFB' },
        text: { primary: '#111827', secondary: '#6B7280' }
    },
    typography: {
        fontFamily: 'inherit', // Inherits font from your Tailwind setup
        h4: { fontWeight: 700, letterSpacing: '-0.02em' },
        h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                }
            }
        }
    }
});
