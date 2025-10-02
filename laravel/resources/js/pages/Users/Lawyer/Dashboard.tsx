import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PropertyDetail, User } from '@/types';
import { DealsList } from "@/components/deals/DealsList";
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Paper,
    Card,
    CardContent,
    Divider
} from '@mui/material';

export default function Dashboard({ auth, deals }: { auth: { user: User }, deals: PropertyDetail[] }) {
    const openDeals = deals.filter(d => d.status === 'open').length;
    const closedDeals = deals.filter(d => d.status === 'closed').length;
    const pendingDeals = deals.filter(d => d.status === 'pending').length;

    return (
        <AuthenticatedLayout
            header={<Typography variant="h5" fontWeight="bold">⚖️ Lawyer Dashboard</Typography>}
        >
            <Head title="Lawyer Dashboard" />

            <Box sx={{ p: 3 }}>
                {/* Profile Card */}
                <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">{auth.user.name}</Typography>
                            <Typography color="text.secondary">
                                Lawyer Number: {auth.user.lawyer_number}
                            </Typography>
                        </Box>
                        <Avatar
                            src={auth.user.avatar_url || "/default-lawyer.png"}
                            alt="Lawyer Avatar"
                            sx={{ width: 64, height: 64 }}
                        />
                    </CardContent>
                </Card>

                {/* Stats Section */}
                <Grid container spacing={3} mb={4}>
                    <Grid size={{xs: 12, md:4}} >
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary">Open Deals</Typography>
                            <Typography variant="h4" color="primary">{openDeals}</Typography>
                        </Paper>
                    </Grid>
                    <Grid  size={{xs: 12, md:4}}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary">Closed Deals</Typography>
                            <Typography variant="h4" color="success.main">{closedDeals}</Typography>
                        </Paper>
                    </Grid>
                    <Grid  size={{xs: 12, md:4}}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary">Pending</Typography>
                            <Typography variant="h4" color="warning.main">{pendingDeals}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/*/!* Deals Section *!/*/}
                {/*<Card>*/}
                {/*    <CardContent>*/}
                {/*        <Typography variant="h6" fontWeight="bold" gutterBottom>*/}
                {/*            Your Deals*/}
                {/*        </Typography>*/}
                {/*        <Divider sx={{ mb: 2 }} />*/}
                {/*        <DealsList deals={deals} />*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
            </Box>
        </AuthenticatedLayout>
    );
}
