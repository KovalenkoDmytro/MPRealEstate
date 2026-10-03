import { Box } from '@mui/material';
import { AccessTimeRounded, CheckCircleOutlineRounded, HighlightOffRounded, HandshakeOutlined } from '@mui/icons-material';
import type { DealStats } from '@/types/models';
import StatCard from '@/components/common/StatCard';
import DashboardSection from '../DashboardSection';
import { primary, success, warning, error } from '@/design/tokens';

type Props = { stats: DealStats; view?: 'column' | 'row' };

export default function DealPerformance({ stats, view = 'row' }: Props) {
    const cards = [
        { label: 'Pending deals', value: stats.pending, icon: <AccessTimeRounded />, tone: warning },
        { label: 'Completed', value: stats.completed, icon: <CheckCircleOutlineRounded />, tone: success },
        { label: 'Broken', value: stats.broken, icon: <HighlightOffRounded />, tone: error },
        { label: 'Total deals', value: stats.total, icon: <HandshakeOutlined />, tone: primary },
    ];
    return (
        <DashboardSection title="Deal activity" description="Track your deals from agreement to completion." href={route('deals.index')}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: view === 'column' ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
                {cards.map((card) => <StatCard key={card.label} variant="dashboard" label={card.label} value={card.value || 0} icon={card.icon} iconBgColor={card.tone[50]} iconColor={card.tone[700]} />)}
            </Box>
        </DashboardSection>
    );
}
