import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import { PropertyDetail } from '@/types';
import { DealsList } from "@/components/deals/DealsList";
import { Typography, Box, Card, CardContent, Divider } from '@mui/material';

export default function DealsPage({ deals }: { deals: PropertyDetail[] }) {
    return (
        <AuthenticatedLayout
            header={<Typography variant="h5" fontWeight="bold">📑 Deals</Typography>}
            title="Deals"
        >

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
