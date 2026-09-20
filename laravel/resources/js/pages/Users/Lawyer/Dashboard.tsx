import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import { User } from '@/types';
import { Box, Typography, Avatar, Grid, Stack } from '@mui/material';
import SectionCard from '@/design/SectionCard';
import StatCard from '@/components/common/StatCard';
import { success, warning } from '@/design/tokens';
import IconConfirm from '@/icons/IconConfirm';
import IconClock from '@/icons/IconClock';

export default function Dashboard({ auth, deals_detail }: { auth: { user: User }, deals_detail: {closed_deals : number,  pending_deals: number} }) {

    return (
        <AuthenticatedLayout
            header="Lawyer Dashboard"
            title="Lawyer Dashboard"
        >

            <Box sx={{ p: { xs: 0, md: 3 } }}>
                {/* Profile Card */}
                <SectionCard sx={{ mb: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
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
                    </Stack>
                </SectionCard>

                {/* Stats Section */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            label="Closed Deals"
                            value={deals_detail.closed_deals}
                            icon={<IconConfirm />}
                            iconBgColor={success[600]}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            label="Pending"
                            value={deals_detail.pending_deals}
                            icon={<IconClock />}
                            iconBgColor={warning[600]}
                        />
                    </Grid>
                </Grid>
            </Box>
        </AuthenticatedLayout>
    );
}
