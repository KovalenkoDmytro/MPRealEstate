import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Typography, Paper, Stack } from '@mui/material';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Welcome to the Dashboard
                        </Typography>
                        <Typography variant="body1">
                            You're logged in! This page is now using Material-UI components.
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button variant="contained" color="primary">
                                Primary Action
                            </Button>
                            <Button variant="outlined" color="secondary">
                                Secondary Action
                            </Button>
                        </Stack>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
