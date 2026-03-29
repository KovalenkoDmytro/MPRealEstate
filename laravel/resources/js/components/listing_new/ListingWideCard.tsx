import React, { useState, useEffect, useRef } from 'react';
import { RealEstateListing } from '@/types';
import { listingService } from "@/services/listingService";
import { useNotification } from "@/context/NotificationContext";
import Button from '@/components/common/Button';
import { formatCurrency } from "@/helpers/priceHelper";
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import {
    Box,
    Divider,
    IconButton,
    Paper,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


type ListingCardProps = {
    listing: RealEstateListing;
    isFavorite: boolean;
    onRemove?: (id: number) => void;
};

export default function ListingWideCard({ listing, isFavorite, onRemove }: ListingCardProps) {
    const theme = useTheme();
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

    const displayImages = images.length > 0 ? images : ['/images/placeholder-house.jpg'];

    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const previousState = isFav;
        const newState = !previousState;
        setIsFav(newState);
        setLoadingFavorite(true);

        if (!newState && onRemove) onRemove(listing.id);

        try {
            const response = await listingService.toggleFavorite(listing.id, previousState);
            if (isMounted.current && response.data) setIsFav(response.data.favorite);
        } catch {
            if (isMounted.current) setIsFav(previousState);
            showNotification("Failed to update favorite.", "error");
        } finally {
            if (isMounted.current) setLoadingFavorite(false);
        }
    };

    const formattedSqft = new Intl.NumberFormat('en-US').format(listing.square_feet);
    const detailUrl = route("buyer.listings.show", listing.id) ;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: theme.shape.borderRadius,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.border.main}`,
                borderColor: theme.palette.border.main,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                bgcolor: theme.palette.background.paper,
            }}
        >
            {/* 1. Left Section: Swiper Image Slider */}
            <Box sx={{
                    width: { xs: '100%', md: 300 },
                    height: { xs: 240, md: 'auto' },
                    minHeight: { md: 260 },
                    bgcolor: '#f7fafc',
                    position: 'relative',

                    // --- 1. Custom Navigation Arrows (Circles with Black Bg) ---
                    '& .swiper-button-next, & .swiper-button-prev': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
                        color: '#fff',
                        width: 32,  // Force circle size
                        height: 32,
                        borderRadius: '50%', // Make it round
                        backdropFilter: 'blur(4px)', // Optional: nice glass effect
                        transition: 'background-color 0.2s',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker on hover
                        },
                        '&::after': {
                            fontSize: '14px', // Smaller icon size
                            fontWeight: 'bold',
                        }
                    },

                    // --- 2. Custom Pagination Dots (Pill with Black Bg) ---
                    '& .swiper-pagination': {
                        bottom: '12px !important', // Lift up from bottom edge
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'auto !important', // Shrink wrap content
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // The pill background
                        padding: '6px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backdropFilter: 'blur(4px)',
                    },
                    '& .swiper-pagination-bullet': {
                        width: 6,
                        height: 6,
                        opacity: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Inactive dot color
                        margin: '0 !important',
                        transition: 'all 0.3s'
                    },
                    '& .swiper-pagination-bullet-active': {
                        backgroundColor: '#fff !important', // Active dot color
                        transform: 'scale(1.2)' // Slight grow effect
                    },
                }}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={displayImages.length > 1}
                    pagination={displayImages.length > 1 ? { clickable: true } : false}
                    loop={displayImages.length > 1}
                    style={{ width: '100%', height: '100%' }}
                >
                    {displayImages.map((src, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                component="img"
                                src={src}
                                alt={`Property view ${index + 1}`}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

            {/* 2. Right Section: Details */}
            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                        {listing.title}
                    </Typography>
                    <IconButton
                        onClick={toggleFavorite}
                        disabled={loadingFavorite}
                        size="small"
                        sx={{
                            color: isFav ? theme.palette.primary.main : theme.palette.text.secondary
                        }}
                    >
                        {isFav ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconLocationMark />
                    {listing.street_number} {listing.street_name}, {listing.city}, {listing.province}
                </Typography>

                <Typography variant="body2" sx={{ color: theme.palette.primary.main, mb: 3, lineClamp: 2, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                    {listing.description}
                </Typography>

                <Stack direction="row" spacing={3} mb="auto">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconBed />
                        <Typography variant="body2" fontWeight={500}>{listing.bedrooms} Beds</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconBath />
                        <Typography variant="body2" fontWeight={500}>{listing.bathrooms} Baths</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconSqft />
                        <Typography variant="body2" fontWeight={500}>{formattedSqft} sq ft</Typography>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="caption" sx={{ letterSpacing: 0.5, color: theme.palette.primary.main, textTransform: 'uppercase' }}>
                            List Price
                        </Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ color: theme.palette.text.primary }}>
                            {formatCurrency(listing.price)}
                        </Typography>
                    </Box>

                    <Box width={150}>
                        <Button
                            version="outline"
                            text="View Details"
                            link={true}
                            href={detailUrl}
                            className="w-full justify-center"
                        />
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}
