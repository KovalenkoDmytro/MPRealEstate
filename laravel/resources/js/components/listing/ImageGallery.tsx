import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Badge from "@/components/common/Badge";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import theme from "@/theme";
import {formatCurrency} from "@/helpers/priceHelper";

interface ImageGalleryProps {
    mainImage: { image_path: string } | null;
    images: Array<{ id: number; image_path: string }>;
    price: string | number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ mainImage, images, price }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

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
                mb: 4 ,
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
        }}>
            {/* Main Slider */}
            <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="main-listing-slider"
                style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '550px',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }}
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
                            top: 20,
                            right: 20,
                        }}
                    >
                    <Badge version="primary" text={formatCurrency(price)}/>
                    </Box>
                )}
            </Swiper>

            {/* Thumbnails Slider */}
            <Box sx={{ p: 2}}>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={15}
                    slidesPerView={6}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    style={{ height: '100px'}}
                >
                    {allImages.map((img, index) => (
                        <SwiperSlide key={`thumb-${index}`} style={{ cursor: 'pointer' }}>
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

        </Box>
    );
};
