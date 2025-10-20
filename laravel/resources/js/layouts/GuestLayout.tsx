import ApplicationLogo from '@/components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Box, Paper, Stack } from '@mui/material';

export default function Guest({ children }: PropsWithChildren) {
    return (
        // Use Box for the main container, handling background and centering
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'grey.100', // Equivalent to bg-gray-100
            }}
        >
            <Stack spacing={2} alignItems="center" sx={{ width: '100%', p: 2 }}>
                <div>
                    <Link href="/">
                        {/* The logo can keep its Tailwind classes, as they are self-contained */}
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>
                </div>

                {/* Use Paper for the card effect (background, shadow, rounded corners) */}
                <Paper
                    elevation={3} // Controls the shadow depth, similar to shadow-md
                    sx={{
                        p: 4, // Sets padding on all sides
                        width: '100%',
                        maxWidth: 450, // Matches the max-width of your form
                        borderRadius: 2, // Equivalent to rounded-lg
                    }}
                >
                    {children}
                </Paper>
            </Stack>
        </Box>
    );
}
