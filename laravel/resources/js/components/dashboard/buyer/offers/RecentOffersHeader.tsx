import { Box, Chip, Typography } from '@mui/material';
import RecentOffersFooter from './RecentOffersFooter';

export default function RecentOffersHeader({ total }: { total: number }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                    <Typography component="h2" variant="h5" sx={{ color: 'common.white', fontWeight: 700 }}>
                        Recent Offers
                    </Typography>
                    <Chip label={total} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'common.white', border: '1px solid rgba(255,255,255,0.16)' }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Your latest offers, at a glance.
                </Typography>
            </Box>
            {total > 3 && <RecentOffersFooter count={total} href={route('offers.index')} />}
        </Box>
    );
}
