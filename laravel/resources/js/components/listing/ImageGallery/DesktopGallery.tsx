import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ZoomIn } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Badge from "@/components/common/Badge";
import { formatCurrency } from "@/helpers/priceHelper";
import theme from "@/theme";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface DesktopGalleryProps {
    images: Array<{ image_path: string }>;
    price?: string | number;
    onOpenLightbox: (index: number) => void;
}

export const DesktopGallery: React.FC<DesktopGalleryProps> = ({ images, price, onOpenLightbox }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                border: `1px solid ${theme.palette.border.main}`,
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.background.white,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    height: { sm: 420, md: 550 },
                    width: "100%",
                    overflow: "hidden",
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                    position: "relative",
                    cursor: "pointer",
                    "&:hover .zoom-hint": { opacity: 1 },
                }}
            >
                <Swiper
                    style={{ height: "100%", width: "100%" }}
                    navigation={images.length > 1}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[Navigation, Thumbs]}
                    onActiveIndexChange={(s) => setActiveIndex(s.activeIndex)}
                    onClick={() => onOpenLightbox(activeIndex)}
                    spaceBetween={10}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={img.image_path}
                                alt={`Property ${index}`}
                                loading="lazy"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Box
                    className="zoom-hint"
                    sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        zIndex: 2,
                        opacity: 0,
                        transition: "opacity 0.2s",
                        bgcolor: "rgba(0,0,0,0.5)",
                        borderRadius: "6px",
                        px: 1,
                        py: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "white",
                        pointerEvents: "none",
                    }}
                >
                    <ZoomIn fontSize="small" />
                    <Typography variant="caption" color="white">View photos</Typography>
                </Box>

                {price && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: { xs: 12, sm: 20 },
                            right: { xs: 12, sm: 20 },
                            zIndex: 2,
                        }}
                    >
                        <Badge version="primary" text={formatCurrency(price)} />
                    </Box>
                )}
            </Box>

            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={15}
                    slidesPerView={6}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs]}
                    style={{ height: "100px" }}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={`thumb-${index}`} style={{ cursor: "pointer" }}>
                            <Box
                                sx={{
                                    height: "100%",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={img.image_path}
                                    alt={`Thumbnail ${index}`}
                                    loading="lazy"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        </Box>
    );
};
