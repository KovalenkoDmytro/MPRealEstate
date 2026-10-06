import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Badge from "@/components/common/Badge";
import SectionCard from "@/design/SectionCard";
import { formatCurrency } from "@/helpers/priceHelper";
import theme from "@/theme";

interface MobileGalleryProps {
    images: Array<{ image_path: string }>;
    price?: string | number;
    onOpenLightbox: (index: number) => void;
}

export const MobileGallery: React.FC<MobileGalleryProps> = ({ images, price, onOpenLightbox }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <SectionCard sx={{ width: "100%", position: "relative", p: 0, overflow: "hidden" }}>
            <Box
                component="button"
                type="button"
                aria-label={`Open property photo ${activeIndex + 1}`}
                onClick={() => onOpenLightbox(activeIndex)}
                sx={{
                    height: "280px",
                    border: 0,
                    p: 0,
                    display: "block",
                    width: "100%",
                    overflow: "hidden",
                    cursor: "pointer",
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                    position: "relative",
                }}
            >
                <img
                    src={images[activeIndex].image_path}
                    alt="Property"
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                <Typography component="span" variant="caption" sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: 'rgba(0,0,0,0.55)', color: 'white', px: 1.5, py: 0.75, borderRadius: '24px' }}>
                    View photos · {activeIndex + 1} / {images.length}
                </Typography>
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

            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: "8px",
                    p: 1.5,
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                {images.map((img, index) => (
                    <Box
                        component="button"
                        type="button"
                        aria-label={`Show property photo ${index + 1}`}
                        aria-pressed={activeIndex === index}
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        sx={{
                            border: 0,
                            p: 0,
                            height: "72px",
                            width: "96px",
                            flexShrink: 0,
                            scrollSnapAlign: "start",
                            borderRadius: "8px",
                            overflow: "hidden",
                            cursor: "pointer",
                            outline: activeIndex === index ? "2px solid" : "none",
                            outlineColor: "primary.main",
                            opacity: activeIndex === index ? 1 : 0.6,
                            transition: "opacity 0.2s",
                        }}
                    >
                        <img
                            src={img.image_path}
                            alt={`Thumbnail ${index}`}
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </Box>
                ))}
            </Box>
        </SectionCard>
    );
};
