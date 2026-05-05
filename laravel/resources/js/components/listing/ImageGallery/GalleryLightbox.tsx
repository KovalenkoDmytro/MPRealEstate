import React from "react";
import { Box, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface GalleryLightboxProps {
    open: boolean;
    initialIndex: number;
    images: Array<{ image_path: string }>;
    onClose: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ open, initialIndex, images, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} fullScreen keepMounted={false}>
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "black",
                    position: "relative",
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        color: "white",
                        zIndex: 999,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                >
                    <Swiper
                        initialSlide={initialIndex}
                        navigation={true}
                        keyboard={{ enabled: true }}
                        modules={[Navigation, Keyboard]}
                        style={{ width: "100%", height: "100%" }}
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                    }}
                                >
                                    <img
                                        src={img.image_path}
                                        alt={`Lightbox ${index}`}
                                        loading="lazy"
                                        style={{
                                            maxHeight: "90vh",
                                            maxWidth: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Box>
        </Dialog>
    );
};
