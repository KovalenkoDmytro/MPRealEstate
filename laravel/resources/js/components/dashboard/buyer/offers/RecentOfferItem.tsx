import { Box, Typography, ButtonBase } from '@mui/material';
import { Link as InertiaLink } from '@inertiajs/react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { Offer } from '@/types/offer';
import { formatCurrency } from '@/helpers/priceHelper';
import OfferStatusChip from './OfferStatusChip';
import SectionCard from '@/design/SectionCard';
import { primary, neutral, success, motion } from '@/design/tokens';

type RecentOfferItemProps = { offer: Offer };

export default function RecentOfferItem({ offer }: RecentOfferItemProps) {
    const listingPrice = Number(offer.listing.price);
    const offerAmount = Number(offer.amount);
    const difference = offerAmount - listingPrice;
    const percentage = listingPrice > 0 ? Math.abs(difference / listingPrice * 100).toFixed(1) : null;
    const detailUrl = route('listings.show', offer.listing.id);

    return (
        <SectionCard sx={{
            minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column',
            p: { xs: 2.5, sm: 3 }, bgcolor: neutral[50],
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 2.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Property offer
                </Typography>
                <OfferStatusChip status={offer.status} />
            </Box>
            <Typography component="h3" variant="h6" sx={{ fontWeight: 700, lineHeight: 1.4, mb: 3, overflowWrap: 'anywhere' }}>
                <ButtonBase LinkComponent={InertiaLink} href={detailUrl} sx={{ textAlign: 'left', font: 'inherit', color: 'text.primary', '&:hover': { color: primary[700] }, '&:focus-visible': { outline: `2px solid ${primary[600]}`, outlineOffset: 4 } }}>
                    {offer.listing.title}
                </ButtonBase>
            </Typography>
            <Box sx={{ mt: 'auto' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Your offer</Typography>
                <Typography sx={{ fontSize: { xs: '1.75rem', sm: '2rem' }, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.2, color: primary[900], fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>
                    {formatCurrency(offerAmount)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mt: 2, mb: 2.5 }}>
                    <Typography variant="body2" color="text.secondary">Listing price</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(listingPrice)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, borderTop: `1px solid ${neutral[200]}`, pt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: difference < 0 ? success[700] : primary[700] }}>
                        {difference < 0 && <TrendingDownRoundedIcon sx={{ fontSize: 18 }} />}
                        {difference > 0 && <TrendingUpRoundedIcon sx={{ fontSize: 18 }} />}
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {percentage === null ? 'Price comparison unavailable' : difference === 0 ? 'At asking price' : `${percentage}% ${difference < 0 ? 'below' : 'above'} asking`}
                        </Typography>
                    </Box>
                    <ButtonBase LinkComponent={InertiaLink} href={detailUrl} aria-label={`View ${offer.listing.title}`} sx={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 36, height: 36, flexShrink: 0, borderRadius: '50%', bgcolor: primary[50], color: primary[700],
                        transition: `background-color ${motion.duration.fast}ms`,
                        '&:hover': { bgcolor: primary[100] },
                        '&:focus-visible': { outline: `2px solid ${primary[600]}`, outlineOffset: 3 },
                    }}>
                        <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                    </ButtonBase>
                </Box>
            </Box>
        </SectionCard>
    );
}
