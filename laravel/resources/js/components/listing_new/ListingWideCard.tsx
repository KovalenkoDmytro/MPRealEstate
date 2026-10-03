import React, { useState, useEffect, useRef } from 'react';
import { RealEstateListing } from '@/types';
import { listingService } from "@/services/listingService";
import { useNotification } from "@/context/NotificationContext";
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Link } from '@inertiajs/react';
import { PropertyStatus } from '@/types/realEstateListing';
import { neutral, primary, radius } from '@/design/tokens';
import { formatCurrency } from "@/helpers/priceHelper";
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import {
    Box,
    ButtonBase,
    Divider,
    IconButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder, ArrowForwardRounded } from "@mui/icons-material";
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


type ListingCardProps = {
    listing: RealEstateListing;
    isFavorite: boolean;
    onRemove?: (id: number) => void;
};

export default function ListingWideCard({ listing, isFavorite, onRemove }: ListingCardProps) {
    const { showNotification } = useNotification();

    // --- Favorite Logic State ---
    const [isFav, setIsFav] = useState(isFavorite);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const isMounted = useRef(true);

    // Prepare images
    const images = [
        listing.main_image?.image_path,
        ...(listing.images?.map(img => img.image_path) || [])
    ].filter((img): img is string => !!img);
    const uniqueImages = [...new Set(images)];

    const displayImages = uniqueImages.length > 0 ? uniqueImages : ['/images/placeholder-house.jpg'];

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const toggleFavorite = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const previousState = isFav;
        const newState = !previousState;
        setIsFav(newState);
        setLoadingFavorite(true);
        if (!newState && onRemove) onRemove(listing.id);

        try {
            const response = await listingService.toggleFavorite(listing.id, previousState);
            if (isMounted.current) {
                const favorite = response.data?.favorite ?? response.favorite;
                if (typeof favorite === 'boolean') setIsFav(favorite);
            }
        } catch {
            if (isMounted.current) setIsFav(previousState);
            showNotification("Failed to update favorite.", "error");
        } finally {
            if (isMounted.current) setLoadingFavorite(false);
        }
    };

    const formattedSqft = new Intl.NumberFormat('en-US').format(listing.square_feet);
    const detailUrl = route('listings.show', listing.id);

    return (
        <Paper component="article" elevation={0} sx={{
            overflow: 'hidden', display: 'flex', flexDirection: { xs: 'column', md: 'row' },
            bgcolor: neutral[50], borderRadius: radius.lg, border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}>
            <Box sx={{
                width: { xs: '100%', md: '32%' }, maxWidth: { md: 380 }, flexShrink: 0,
                height: { xs: 240, md: 'auto' }, minHeight: { md: 290 },
                position: 'relative', bgcolor: neutral[200],
                '& .swiper-button-next, & .swiper-button-prev': {
                    width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(23,26,34,0.65)', color: 'common.white',
                    '& svg': { width: 12, height: 12 }, '&::after': { fontSize: 12 },
                    '&:hover': { bgcolor: 'rgba(23,26,34,0.9)' },
                },
                '& .swiper-pagination': {
                    bottom: '12px !important', left: '50%', transform: 'translateX(-50%)', width: 'auto !important',
                    bgcolor: 'rgba(23,26,34,0.65)', px: 1.25, py: 0.75, borderRadius: radius.pill,
                },
                '& .swiper-pagination-bullet': { width: 6, height: 6, bgcolor: 'common.white', opacity: 0.5 },
                '& .swiper-pagination-bullet-active': { opacity: 1 },
            }}>
                <Swiper modules={[A11y, Navigation, Pagination]} navigation={displayImages.length > 1}
                    pagination={displayImages.length > 1 ? { clickable: true } : false}
                    loop={displayImages.length > 1} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    {displayImages.map((src, index) => (
                        <SwiperSlide key={src}>
                            <Box component="img" src={src} alt={`${listing.title}, photo ${index + 1}`} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
                    <Badge text={listing.status} size="small" version={listing.status === PropertyStatus.Available ? 'success' : listing.status === PropertyStatus.Pending ? 'warning' : 'neutral'} />
                </Box>
                <IconButton onClick={toggleFavorite} disabled={loadingFavorite} aria-pressed={isFav}
                    aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'} sx={{
                        position: 'absolute', top: 12, right: 12, zIndex: 2, width: 40, height: 40,
                        bgcolor: neutral[0], color: isFav ? primary[600] : neutral[700],
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        '&:hover': { bgcolor: primary[50] },
                        '&.Mui-disabled': { bgcolor: neutral[0], color: neutral[400] },
                    }}>
                    {isFav ? <Favorite sx={{ fontSize: 20 }} /> : <FavoriteBorder sx={{ fontSize: 20 }} />}
                </IconButton>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h3" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 700, lineHeight: 1.4, mb: 1 }}>
                    <ButtonBase LinkComponent={Link} href={detailUrl} sx={{ font: 'inherit', textAlign: 'left', color: neutral[800], overflowWrap: 'anywhere', '&:hover': { color: primary[700] } }}>{listing.title}</ButtonBase>
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.75, color: neutral[600], mb: 1.5, '& svg': { flexShrink: 0, mt: '2px' } }}>
                    <IconLocationMark />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', overflowWrap: 'anywhere' }}>{[`${listing.street_number} ${listing.street_name}`.trim(), listing.city, listing.province].filter(Boolean).join(', ')}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: neutral[600], mb: 2, lineHeight: 1.6, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{listing.description}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, '& > span': { display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: neutral[100], px: 1.25, py: 0.75, borderRadius: radius.sm, color: neutral[600] } }}>
                    <Typography component="span" variant="caption"><IconBed />{listing.bedrooms} beds</Typography>
                    <Typography component="span" variant="caption"><IconBath />{listing.bathrooms} baths</Typography>
                    <Typography component="span" variant="caption"><IconSqft />{formattedSqft} sqft</Typography>
                </Box>
                <Divider sx={{ mt: 'auto', mb: 2, borderColor: neutral[200] }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: neutral[600] }}>Listing price</Typography>
                        <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', color: primary[900], fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(listing.price)}</Typography>
                    </Box>
                    <Button version="primary" text="View details" link href={detailUrl} fullWidth={false} icon={<ArrowForwardRounded sx={{ fontSize: 18 }} />} />
                </Stack>
            </Box>
        </Paper>
    );
}
