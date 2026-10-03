import { Box } from '@mui/material';
import { AccessTimeRounded, CheckCircleOutlineRounded, HighlightOffRounded, InboxOutlined } from '@mui/icons-material';
import type { OfferStats } from '@/types/models';
import StatCard from '@/components/common/StatCard';
import DashboardSection from '../DashboardSection';
import { primary, success, warning, error } from '@/design/tokens';

type Props = { stats: OfferStats; view?: 'column' | 'row' };

export default function OfferPerformance({ stats, view = 'row' }: Props) {
    const cards = [
        { label: 'Pending response', value: stats.pending, icon: <AccessTimeRounded />, tone: warning },
        { label: 'Accepted', value: stats.accepted, icon: <CheckCircleOutlineRounded />, tone: success },
        { label: 'Rejected', value: stats.rejected, icon: <HighlightOffRounded />, tone: error },
        { label: 'Total received', value: stats.total, icon: <InboxOutlined />, tone: primary },
    ];
    return (
        <DashboardSection title="Offer activity" description="Keep track of buyer interest and your responses." href={route('offers.index')}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: view === 'column' ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
                {cards.map((card) => <StatCard key={card.label} variant="dashboard" label={card.label} value={card.value || 0} icon={card.icon} iconBgColor={card.tone[50]} iconColor={card.tone[700]} />)}
            </Box>
        </DashboardSection>
    );
}
