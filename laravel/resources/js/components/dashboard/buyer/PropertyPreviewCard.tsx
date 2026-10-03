import { Box, ButtonBase, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import type { RealEstateListing } from '@/types';
import { PropertyStatus } from '@/types/realEstateListing';
import Badge from '@/components/common/Badge';
import IconLocationMark from '@/icons/IconLocationMark';
import IconBed from '@/icons/IconBed';
import IconBath from '@/icons/IconBath';
import IconSqft from '@/icons/IconSqft';
import { formatCurrency } from '@/helpers/priceHelper';
import { neutral, primary, radius, motion } from '@/design/tokens';

type PropertyPreviewCardProps = { listing: RealEstateListing };

export default function PropertyPreviewCard({ listing }: PropertyPreviewCardProps) {
    const detailUrl = typeof route === 'function' ? route('listings.show', listing.id) : `/listings/${listing.id}`;
    const address = [
        [listing.street_number, listing.street_name].filter(Boolean).join(' '),
        listing.city, listing.province,
    ].filter(Boolean).join(', ');
    const statusVersion = listing.status === PropertyStatus.Available ? 'success'
        : listing.status === PropertyStatus.Pending ? 'warning' : 'neutral';

    return (
        <ButtonBase
            LinkComponent={Link}
            href={detailUrl}
            aria-label={`View ${listing.title}, ${formatCurrency(listing.price)}`}
            sx={{
                display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch',
                width: '100%', minWidth: 0, overflow: 'hidden', textAlign: 'left',
                borderRadius: radius.lg, bgcolor: neutral[50], color: neutral[800],
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                transition: `box-shadow ${motion.duration.fast}ms`,
                '&:hover': { boxShadow: '0 12px 32px rgba(0,0,0,0.2)', '& .property-preview-arrow': { bgcolor: primary[100] } },
                '&:focus-visible': { outline: `3px solid ${primary[200]}`, outlineOffset: 4 },
            }}
        >
            <Box sx={{ position: 'relative', width: { xs: '100%', sm: '34%' }, flexShrink: 0, minHeight: { xs: 176, sm: 210 } }}>
                <Box
                    component="img"
                    src={listing.main_image?.image_path || '/images/placeholder-house.jpg'}
                    alt=""
                    loading="lazy"
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                    <Badge text={listing.status} version={statusVersion} size="small" />
                </Box>
            </Box>
            <Box sx={{ p: { xs: 2.5, sm: 2.5 }, minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h3" sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.4, overflowWrap: 'anywhere', mb: 0.75 }}>
                    {listing.title}
                </Typography>
                {address && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, color: neutral[600], mb: 2, '& svg': { flexShrink: 0, mt: '2px' } }}>
                        <IconLocationMark />
                        <Typography variant="caption" sx={{ lineHeight: 1.5, overflowWrap: 'anywhere' }}>{address}</Typography>
                    </Box>
                )}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, color: neutral[600], mb: 2, '& > span': { display: 'inline-flex', alignItems: 'center', gap: 0.5 } }}>
                    <Typography component="span" variant="caption"><IconBed />{listing.bedrooms} beds</Typography>
                    <Typography component="span" variant="caption"><IconBath />{listing.bathrooms} baths</Typography>
                    <Typography component="span" variant="caption"><IconSqft />{new Intl.NumberFormat('en-US').format(listing.square_feet)} sqft</Typography>
                </Box>
                <Box sx={{ mt: 'auto', pt: 1.5, borderTop: `1px solid ${neutral[200]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" sx={{ color: neutral[600] }}>Listing price</Typography>
                        <Typography sx={{ color: primary[900], fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>
                            {formatCurrency(listing.price)}
                        </Typography>
                    </Box>
                    <Box className="property-preview-arrow" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', bgcolor: primary[50], color: primary[700], flexShrink: 0 }}>
                        <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                    </Box>
                </Box>
            </Box>
        </ButtonBase>
    );
}
