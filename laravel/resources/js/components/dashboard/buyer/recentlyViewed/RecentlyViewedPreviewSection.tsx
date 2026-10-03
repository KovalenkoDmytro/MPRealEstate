import { Box, Typography } from '@mui/material';
import type { RealEstateListing } from '@/types';
import RecentlyViewedMiniCard from './RecentlyViewedMiniCard';

type RecentlyViewedPreviewSectionProps = {
    recentlyViewedListings: RealEstateListing[];
    itemsToDisplay: number;
};

export function RecentlyViewedPreviewSection({ recentlyViewedListings, itemsToDisplay }: RecentlyViewedPreviewSectionProps) {
    return (
        <Box component="section" sx={{ minWidth: 0, display: { lg: 'grid' }, gridTemplateRows: { lg: 'subgrid' }, gridRow: { lg: `span ${itemsToDisplay + 1}` } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, lg: 0 } }}>
                <Box>
                    <Typography component="h2" variant="h5" sx={{ color: 'common.white', fontWeight: 700, mb: 0.75 }}>Recently Viewed</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Pick up where you left off.</Typography>
                </Box>
            </Box>
            <Box sx={{ display: { xs: 'grid', lg: 'contents' }, gap: 2.5 }}>
                {recentlyViewedListings.slice(0, itemsToDisplay).map((listing) => <RecentlyViewedMiniCard key={listing.id} listing={listing} />)}
            </Box>
        </Box>
    );
}
