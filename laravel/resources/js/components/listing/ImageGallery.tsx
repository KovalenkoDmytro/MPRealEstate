import React, { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Badge from "@/components/common/Badge";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import theme from "@/theme";
import {formatCurrency} from "@/helpers/priceHelper";

interface ImageGalleryProps {
    mainImage: { image_path: string } | null;
    images: Array<{ id: number; image_path: string }>;
    price?: string | number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ mainImage, images, price }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [mounted, setMounted] = useState(false);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
    const effectiveIsMobile = mounted ? isMobile : false;

    useEffect(() => setMounted(true), []);

    // Combine main image and gallery images for the slider
    const allImages = mainImage ? [mainImage, ...images] : images;

    if (!allImages || allImages.length === 0) {
        return (
            <Box sx={{ height: 400, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "grey.100", borderRadius: 4 }}>
                <Typography color="textSecondary">No Images Available</Typography>
            </Box>
        );
    }

    return (
        <Box
            className="listing-gallery"
            sx={{ width: "100%",
                position: "relative",
                mb: { xs: 3, md: 4 },
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
                overflow: "hidden",
                '& .main-listing-slider': {
                    height: { xs: 260, sm: 420, md: 550 },
                    minHeight: { xs: 260, sm: 420, md: 550 },
                    borderRadius: '16px',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                },
                '& .main-listing-slider .swiper-button-next, & .main-listing-slider .swiper-button-prev': {
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    display: { xs: 'none', sm: 'flex' },
                },
                '& .main-listing-slider .swiper-button-next:after, & .main-listing-slider .swiper-button-prev:after': {
                    fontSize: { xs: '16px', sm: '20px' },
                },
                '& .main-listing-slider .swiper-pagination': {
                    bottom: { xs: '10px', sm: '16px' },
                },
                '& .main-listing-slider .swiper-pagination-bullet': {
                    width: 8,
                    height: 8,
                    bgcolor: 'rgba(255, 255, 255, 0.55)',
                    opacity: 1,
                },
                '& .main-listing-slider .swiper-pagination-bullet-active': {
                    bgcolor: theme.palette.background.white,
                },
        }}>
            {/* Main Slider */}
            <Swiper
                spaceBetween={10}
                navigation={!effectiveIsMobile && allImages.length > 1}
                pagination={effectiveIsMobile && allImages.length > 1 ? { clickable: true } : false}
                thumbs={{ swiper: !effectiveIsMobile && thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Pagination, Thumbs]}
                observer={true}
                observeParents={true}
                onInit={(swiper) => { setTimeout(() => swiper.update(), 0); }}
                className="main-listing-slider"
            >
                {allImages.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={img.image_path}
                            alt={`Property ${index}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover',  }}
                        />
                    </SwiperSlide>
                ))}


                {price && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: { xs: 12, sm: 20 },
                            right: { xs: 12, sm: 20 },
                            zIndex: 2,
                        }}
                    >
                    <Badge version="primary" text={formatCurrency(price)}/>
                    </Box>
                )}
            </Swiper>

            {/* Thumbnails Slider */}
            {!effectiveIsMobile && (
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={isMobile ? 10 : 15}
                    slidesPerView={isMobile ? 4 : 6}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Pagination, Thumbs]}
                    style={{ height: isMobile ? '72px' : '100px', minWidth: 0 }}
                >
                    {allImages.map((img, index) => (
                        <SwiperSlide key={`thumb-${index}`} style={{ cursor: 'pointer', minWidth: 0 }}>
                            <Box
                                sx={{
                                    height: '100%',
                                    borderRadius: '12px',
                                    overflow: 'hidden',

                                }}
                            >
                                <img
                                    src={img.image_path}
                                    alt={`Thumb ${index}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            )}

        </Box>
    );
};
