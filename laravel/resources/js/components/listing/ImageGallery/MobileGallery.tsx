import React, { useState } from "react";
import { Box } from "@mui/material";
import Badge from "@/components/common/Badge";
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
                onClick={() => onOpenLightbox(activeIndex)}
                sx={{
                    height: "260px",
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
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        sx={{
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
        </Box>
    );
};
