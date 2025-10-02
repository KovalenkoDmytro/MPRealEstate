import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PropertyDetail, User } from '@/types';
import { DealsList } from "@/components/deals/DealsList";
import { Typography, Box, Card, CardContent, Divider } from '@mui/material';

export default function DealsPage({ auth, deals }: { auth: { user: User }, deals: PropertyDetail[] }) {
    return (
        <AuthenticatedLayout
            header={<Typography variant="h5" fontWeight="bold">📑 Deals</Typography>}
        >
            <Head title="Deals" />

            <Box sx={{ p: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            All Deals
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <DealsList deals={deals} />
                    </CardContent>
                </Card>
            </Box>
        </AuthenticatedLayout>
    );
}
