import { Box } from '@mui/material';
import { AccessTimeRounded, CheckCircleOutlineRounded, PendingActionsRounded, HighlightOffRounded, EventAvailableRounded, EventBusyRounded } from '@mui/icons-material';
import StatCard from '@/components/common/StatCard';
import { primary, success, warning, error, neutral } from '@/design/tokens';

type AppointmentsOverviewProps = {
    todayCount: number;
    upcomingCount: number;
    acceptedCount: number;
    rejectedCount?: number;
    pendingCount: number;
    cancelledCount: number;
};

export default function AppointmentsOverviewCards({ todayCount, upcomingCount, acceptedCount, rejectedCount, pendingCount, cancelledCount }: AppointmentsOverviewProps) {
    const stats = [
        { label: 'Today', value: todayCount, icon: <AccessTimeRounded />, tone: primary },
        { label: 'Upcoming', value: upcomingCount, icon: <EventAvailableRounded />, tone: primary },
        { label: 'Confirmed', value: acceptedCount, icon: <CheckCircleOutlineRounded />, tone: success },
        { label: 'Pending', value: pendingCount, icon: <PendingActionsRounded />, tone: warning },
        ...(rejectedCount !== undefined ? [{ label: 'Rejected', value: rejectedCount, icon: <HighlightOffRounded />, tone: error }] : []),
        { label: 'Cancelled', value: cancelledCount, icon: <EventBusyRounded />, tone: neutral },
    ];

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', xl: `repeat(${stats.length}, minmax(0, 1fr))` }, gap: { xs: 1.5, sm: 2 } }}>
            {stats.map((stat) => <StatCard key={stat.label} variant="dashboard" label={stat.label} value={stat.value} icon={stat.icon} iconBgColor={stat.tone[50]} iconColor={stat.tone[700]} />)}
        </Box>
    );
}
