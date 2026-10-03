import { Box, Button, Chip, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import type { FavoriteListings } from '@/types/favoriteListings';
import SavedPropertyMiniCard from './SavedPropertyMiniCard';

type SavedPropertiesPreviewSectionProps = {
    favoriteListing: FavoriteListings;
    itemsToDisplay: number;
};

export default function SavedPropertiesPreviewSection({ favoriteListing, itemsToDisplay }: SavedPropertiesPreviewSectionProps) {
    return (
        <Box component="section" className="saved-properties-preview-section" sx={{ minWidth: 0, display: { lg: 'grid' }, gridTemplateRows: { lg: 'subgrid' }, gridRow: { lg: `span ${itemsToDisplay + 1}` } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: { xs: 3, lg: 0 } }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                        <Typography component="h2" variant="h5" sx={{ color: 'common.white', fontWeight: 700 }}>Saved Properties</Typography>
                        <Chip label={favoriteListing.total} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'common.white', border: '1px solid rgba(255,255,255,0.16)' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Keep your favorites close.</Typography>
                </Box>
                {favoriteListing.total > itemsToDisplay && (
                    <Button LinkComponent={Link} href={route('listings.favorites.index')} endIcon={<ArrowForwardRoundedIcon />} sx={{
                        color: 'common.white', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.06)', px: 2, py: 1,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.4)' },
                    }}>View all</Button>
                )}
            </Box>
            <Box sx={{ display: { xs: 'grid', lg: 'contents' }, gap: 2.5 }}>
                {favoriteListing.data.slice(0, itemsToDisplay).map((listing) => <SavedPropertyMiniCard key={listing.id} listing={listing} />)}
            </Box>
        </Box>
    );
}
