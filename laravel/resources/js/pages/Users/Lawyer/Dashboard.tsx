import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import { User } from '@/types';
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Paper,
    Card,
    CardContent,
} from '@mui/material';

export default function Dashboard({ auth, deals_detail }: { auth: { user: User }, deals_detail: {closed_deals : number,  pending_deals: number} }) {

    return (
        <AuthenticatedLayout
            header={<Typography variant="h5" fontWeight="bold">⚖️ Lawyer Dashboard</Typography>}
            title="Lawyer Dashboard"
        >

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
                            src={"/default-lawyer.png"}
                            alt="Lawyer Avatar"
                            sx={{ width: 64, height: 64 }}
                        />
                    </CardContent>
                </Card>

                {/* Stats Section */}
                <Grid container spacing={3} mb={4}>
                    <Grid  size={{xs: 12, md:4}}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary">Closed Deals</Typography>
                            <Typography variant="h4" color="success.main">{deals_detail.closed_deals}</Typography>
                        </Paper>
                    </Grid>
                    <Grid  size={{xs: 12, md:4}}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="subtitle1" color="text.secondary">Pending</Typography>
                            <Typography variant="h4" color="warning.main">{deals_detail.pending_deals}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </AuthenticatedLayout>
    );
}
