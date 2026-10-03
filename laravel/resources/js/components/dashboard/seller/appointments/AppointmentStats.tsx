import { Box } from '@mui/material';
import { AccessTimeRounded, CheckCircleOutlineRounded, EventBusyRounded, CalendarMonthRounded } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import type { SellerStats } from '@/types/Appointments/sellerAppointmentsStat';
import StatCard from '@/components/common/StatCard';
import DashboardSection from '../DashboardSection';
import DailyActivityChart from './DailyActivityChart';
import { primary, success, warning, neutral } from '@/design/tokens';

export default function AppointmentStats({ stats }: { stats: SellerStats }) {
    const { pending, completed, cancelled } = stats.summary.breakdown;
    const chartData = stats.chart_data.last_7_days || [];
    const dateRange = chartData.length ? `${format(parseISO(chartData[0].date), 'd MMM')} – ${format(parseISO(chartData[chartData.length - 1].date), 'd MMM')}` : 'Your viewing schedule at a glance';
    const cards = [
        { label: 'Pending', value: pending, icon: <AccessTimeRounded />, tone: warning },
        { label: 'Completed', value: completed, icon: <CheckCircleOutlineRounded />, tone: success },
        { label: 'Cancelled', value: cancelled, icon: <EventBusyRounded />, tone: neutral },
        { label: 'Total · 30 days', value: stats.summary.total_last_30_days, icon: <CalendarMonthRounded />, tone: primary },
    ];
    return (
        <DashboardSection title="Appointments" description={dateRange} href={route('appointments.index')}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
                {cards.map((card) => <StatCard key={card.label} variant="dashboard" label={card.label} value={card.value || 0} icon={card.icon} iconBgColor={card.tone[50]} iconColor={card.tone[700]} />)}
            </Box>
            <DailyActivityChart data={chartData} />
        </DashboardSection>
    );
}
