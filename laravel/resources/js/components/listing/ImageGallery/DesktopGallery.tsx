import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { radius } from "@/design/tokens";
import { ZoomIn } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Badge from "@/components/common/Badge";
import SectionCard from "@/design/SectionCard";
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
        <SectionCard sx={{ width: "100%", position: "relative", p: 0, overflow: "hidden" }}>
            <Box
                sx={{
                    height: { sm: 380, md: 480 },
                    width: "100%",
                    overflow: "hidden",
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                    position: "relative",
                    cursor: "pointer",
                    "&:hover .zoom-hint": { opacity: 1 },
                    '& .swiper-button-next, & .swiper-button-prev': {
                        width: 44, height: 44, borderRadius: radius.pill,
                        bgcolor: 'rgba(255,255,255,0.9)', color: 'text.primary',
                        p: 1.5, boxSizing: 'border-box',
                        '--swiper-navigation-size': '18px',
                        '&::after': { fontSize: 18 },
                    },
                }}
            >
                <Swiper
                    style={{ height: "100%", width: "100%" }}
                    navigation={images.length > 1}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[Navigation, Thumbs]}
                    onActiveIndexChange={(s) => setActiveIndex(s.activeIndex)}
                    onClick={(_, event) => {
                        if (event.target instanceof Element && event.target.closest('.swiper-button-next, .swiper-button-prev')) return;
                        onOpenLightbox(activeIndex);
                    }}
                    spaceBetween={10}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={img.image_path}
                                alt={`Property photo ${index + 1}`}
                                loading={index === 0 ? "eager" : "lazy"}
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
                        opacity: 1,
                        transition: "opacity 0.2s",
                        bgcolor: "rgba(0,0,0,0.5)",
                        borderRadius: radius.pill,
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "white",
                        pointerEvents: "none",
                    }}
                >
                    <ZoomIn fontSize="small" />
                    <Typography variant="caption" color="white">View photos · {activeIndex + 1} / {images.length}</Typography>
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
                    spaceBetween={12}
                    slidesPerView={Math.min(images.length, 6)}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs]}
                    style={{ height: "80px" }}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={`thumb-${index}`} style={{ cursor: "pointer" }}>
                            <Box
                                sx={{
                                    height: "100%",
                                    borderRadius: radius.sm,
                                    overflow: "hidden",
                                    border: '2px solid',
                                    borderColor: activeIndex === index ? 'primary.main' : 'transparent',
                                    opacity: activeIndex === index ? 1 : 0.65,
                                    transition: 'opacity 0.2s',
                                    '&:hover': { opacity: 1 },
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
        </SectionCard>
    );
};
