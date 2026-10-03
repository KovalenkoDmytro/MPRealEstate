import { Box } from '@mui/material';
import { VisibilityOutlined, PeopleOutlineRounded, FavoriteBorderRounded, TrendingUpRounded } from '@mui/icons-material';
import type { PerformanceStats } from '@/types/models';
import StatCard from '@/components/common/StatCard';
import DashboardSection from '../DashboardSection';
import DailyActivityChart from './DailyActivityChart';
import { primary, accent, info } from '@/design/tokens';

export default function PropertyPerformance({ stats }: { stats: PerformanceStats }) {
    const cards = [
        { label: 'Total views', value: stats.views.total, icon: <VisibilityOutlined />, tone: primary },
        { label: 'Unique viewers', value: stats.views.unique, icon: <PeopleOutlineRounded />, tone: info },
        { label: 'Favorites', value: stats.favorites.total, icon: <FavoriteBorderRounded />, tone: accent },
        { label: 'Views · 7 days', value: stats.views.last_7_days, icon: <TrendingUpRounded />, tone: primary },
    ];
    return (
        <DashboardSection title="Property performance" description="See how buyers engage with your listings." href={route('listings.index')}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
                {cards.map((card) => <StatCard key={card.label} variant="dashboard" label={card.label} value={card.value || 0} icon={card.icon} iconBgColor={card.tone[50]} iconColor={card.tone[700]} />)}
            </Box>
            <DailyActivityChart data={stats.chart_data.last_7_days || []} />
        </DashboardSection>
    );
}
