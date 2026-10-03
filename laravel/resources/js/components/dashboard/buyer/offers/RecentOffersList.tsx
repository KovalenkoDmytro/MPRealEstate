import { Box, Typography } from '@mui/material';
import { Offer } from '@/types/offer';
import RecentOfferItem from './RecentOfferItem';
import RecentOffersHeader from './RecentOffersHeader';

interface RecentOffersListProps {
    offers: Offer[];
}

const DISPLAY_LIMIT = 3;

export default function RecentOffersList({ offers }: RecentOffersListProps) {
    const displayedOffers = offers.slice(0, DISPLAY_LIMIT);

    return (
        <Box component="section" className="recent-offers-list" sx={{ width: '100%', minWidth: 0 }}>
            <RecentOffersHeader total={offers.length} />
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(3, minmax(0, 1fr))' },
                gap: 2.5,
                mt: 3,
            }}>
                {displayedOffers.map((offer) => <RecentOfferItem key={offer.id} offer={offer} />)}
                {offers.length === 0 && (
                    <Box sx={{ gridColumn: '1 / -1', p: 4, borderRadius: 3, border: '1px dashed rgba(255,255,255,0.25)', textAlign: 'center' }}>
                        <Typography sx={{ color: 'common.white', fontWeight: 600 }}>You have not made any offers yet.</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>Your latest offers will appear here.</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
