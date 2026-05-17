import React, { useState, useEffect } from "react";
import { Box, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { MobileGallery } from "./MobileGallery";
import { DesktopGallery } from "./DesktopGallery";
import { GalleryLightbox } from "./GalleryLightbox";

interface ImageGalleryProps {
    mainImage: { image_path: string } | null;
    images: Array<{ id: number; image_path: string }>;
    price?: string | number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ mainImage, images, price }) => {
    const [mounted, setMounted] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

    useEffect(() => setMounted(true), []);

    const allImages = mainImage ? [mainImage, ...images] : images;

    if (!allImages || allImages.length === 0) {
        return (
            <Box
                sx={{
                    height: 400,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "grey.100",
                    borderRadius: 4,
                }}
            >
                <Typography color="textSecondary">No Images Available</Typography>
            </Box>
        );
    }

    if (!mounted) {
        return (
            <Skeleton
                variant="rectangular"
                sx={{
                    height: { xs: 260, sm: 420, md: 550 },
                    width: "100%",
                    borderRadius: muiTheme.shape.borderRadius,
                }}
            />
        );
    }

    return (
        <>
            {isMobile ? (
                <MobileGallery
                    images={allImages}
                    price={price}
                    onOpenLightbox={(index) => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                    }}
                />
            ) : (
                <DesktopGallery
                    images={allImages}
                    price={price}
                    onOpenLightbox={(index) => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                    }}
                />
            )}

            <GalleryLightbox
                open={lightboxOpen}
                initialIndex={lightboxIndex}
                images={allImages}
                onClose={() => setLightboxOpen(false)}
            />
        </>
    );
};
