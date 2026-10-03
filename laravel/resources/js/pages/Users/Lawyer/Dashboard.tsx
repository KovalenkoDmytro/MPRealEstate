import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import type { User } from '@/types';
import { Box, Typography, Avatar, Paper, Stack } from '@mui/material';
import { ArrowForwardRounded, CheckCircleOutlineRounded, AccessTimeRounded, GavelRounded } from '@mui/icons-material';
import StatCard from '@/components/common/StatCard';
import Button from '@/components/common/Button';
import { neutral, primary, success, warning, radius } from '@/design/tokens';

type LawyerDashboardProps = {
    auth: { user: User };
    deals_detail: { closed_deals: number; pending_deals: number };
};

export default function Dashboard({ auth, deals_detail }: LawyerDashboardProps) {
    const initials = auth.user.name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();

    return (
        <AuthenticatedLayout header="Lawyer Dashboard" title="Lawyer Dashboard">
            <Stack spacing={4}>
                <Paper component="section" elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, bgcolor: neutral[50], borderRadius: radius.lg, border: `1px solid ${neutral[200]}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                            <Avatar sx={{ width: { xs: 56, sm: 72 }, height: { xs: 56, sm: 72 }, borderRadius: radius.lg, bgcolor: primary[100], color: primary[700], fontSize: '1.5rem', fontWeight: 700 }}>{initials}</Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: primary[700], mb: 0.5 }}><GavelRounded sx={{ fontSize: 16 }} /><Typography variant="caption" fontWeight={600}>Legal workspace</Typography></Stack>
                                <Typography component="h1" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' }, fontWeight: 700, color: neutral[800], overflowWrap: 'anywhere' }}>{auth.user.name}</Typography>
                                <Typography variant="body2" sx={{ color: neutral[600], mt: 0.75, overflowWrap: 'anywhere' }}>Lawyer number: <Box component="span" sx={{ fontWeight: 600, color: neutral[700] }}>{auth.user.lawyer_number || 'Not assigned'}</Box></Typography>
                            </Box>
                        </Stack>
                        <Button version="primary" text="View my deals" link href={route('lawyer.deals.index')} icon={<ArrowForwardRounded />} fullWidth={false} />
                    </Box>
                </Paper>

                <Box component="section">
                    <Box sx={{ mb: 2.5 }}>
                        <Typography component="h2" sx={{ fontSize: '1.4rem', fontWeight: 700, color: neutral[0] }}>Deal overview</Typography>
                        <Typography variant="body2" sx={{ color: neutral[300], mt: 0.5 }}>Track your pending work and completed transactions.</Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
                        <StatCard variant="dashboard" label="Pending deals" value={deals_detail.pending_deals} detail="Deals awaiting completion" icon={<AccessTimeRounded />} iconBgColor={warning[50]} iconColor={warning[700]} />
                        <StatCard variant="dashboard" label="Closed deals" value={deals_detail.closed_deals} detail="Completed transactions" icon={<CheckCircleOutlineRounded />} iconBgColor={success[50]} iconColor={success[700]} />
                    </Box>
                </Box>
            </Stack>
        </AuthenticatedLayout>
    );
}
