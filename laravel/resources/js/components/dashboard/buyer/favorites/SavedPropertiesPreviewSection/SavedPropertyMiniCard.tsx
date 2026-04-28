import { RealEstateListing } from '@/types';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import { Paper, Box, Typography, Stack, Divider } from '@mui/material';
import theme from '@/theme';
import { formatCurrency } from '@/helpers/priceHelper';

type SavedListingMiniCardProps = {
    listing: RealEstateListing;
};

export default function SavedListingMiniCard({ listing }: SavedListingMiniCardProps) {
    const formattedSqft = new Intl.NumberFormat('en-US').format(listing.square_feet);
    const detailUrl = typeof route === 'function'
        ? route("listings.show", listing.id)
        : `/listings/${listing.id}`;
    const mainImage = listing.main_image?.image_path || '/images/placeholder-house.jpg';

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: '#e2e8f0',
                borderRadius: theme.shape.borderRadius,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.palette.background.white,
                width: '100%',
            }}
        >
            {/* Image */}
            <Box sx={{ position: 'relative' }}>
                <Box
                    component="img"
                    src={mainImage}
                    alt={listing.title}
                    sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                />
                <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                    <Badge text={listing.status} version="primary" />
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ color: theme.palette.text.primary, mb: 0.5, lineHeight: 1.3 }}
                >
                    {listing.title}
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}
                >
                    <IconLocationMark />
                    {listing.street_number}, {listing.street_name}, {listing.city}, {listing.province}, {listing.postal_code}
                </Typography>

                <Stack direction="row" spacing={2} mb={1.5}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconBed />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                            <Typography component="span" fontWeight={700}>{listing.bedrooms}</Typography> Beds
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconBath />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                            <Typography component="span" fontWeight={700}>{listing.bathrooms}</Typography> Baths
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconSqft />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                            <Typography component="span" fontWeight={700}>{formattedSqft}</Typography> sqft
                        </Typography>
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 1.5 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto', width: '100%' }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.primary.main, letterSpacing: 0.5 }}>
                            Price
                        </Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ color: theme.palette.text.primary, lineHeight: 1.2 }}>
                            {formatCurrency(listing.price)}
                        </Typography>
                    </Box>
                    <Box sx={{ width: 'fit-content' }}>
                        <Button version="primary" text="Details" link={true} href={detailUrl} />
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}
