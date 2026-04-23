import { useState, useMemo, useEffect, useCallback } from "react";
import { RealEstateListing } from "@/types";
import { Box, Typography, Stack, Paper, Modal, IconButton } from "@mui/material";
import theme from "@/theme";
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import IconHome from "@/icons/IconHome";
import IconClose from "@/icons/IconClose";
import IconArrowLeft from "@/icons/IconArrowLeft";
import IconContainer from "@/components/common/IconContainer";

export default function DealPropertyDetails({ listing }: { listing: RealEstateListing }) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const allImages = useMemo(() => {
        const imgs: string[] = [];
        if (listing.main_image) imgs.push(listing.main_image.image_path);
        listing.images?.forEach((img) => imgs.push(img.image_path));
        return imgs;
    }, [listing.main_image, listing.images]);

    const isOpen = lightboxIndex !== null;
    const total = allImages.length;

    const prev = useCallback(() =>
        setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : 0)),
        [total],
    );

    const next = useCallback(() =>
        setLightboxIndex((i) => (i !== null ? (i + 1) % total : 0)),
        [total],
    );

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft")  prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape")     setLightboxIndex(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, prev, next]);

    const imageSx = {
        width: 120,
        height: 120,
        objectFit: "cover" as const,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.border.main}`,
        cursor: "pointer",
        transition: "opacity 0.2s",
        "&:hover": { opacity: 0.85 },
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
                mb: 3,
            }}
        >
            {/* Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" mb={4}>
                <IconContainer>
                    <IconHome />
                </IconContainer>
                <Typography variant="h5" fontWeight="bold">
                    Property Details
                </Typography>
            </Stack>

            {/* Property Gallery */}
            <Box mb={3}>
                <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.primary.main, mb: 1.5 }}>
                    Property Gallery
                </Typography>

                <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>
                    {allImages.map((src, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={src}
                            alt={`Property ${index + 1}`}
                            sx={imageSx}
                            onClick={() => setLightboxIndex(index)}
                        />
                    ))}
                </Stack>
            </Box>

            {/* Title */}
            <Box mb={3}>
                <Typography variant="body2" fontWeight="bold">
                    Title:
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
                    {listing.title}
                </Typography>
            </Box>

            {/* Description */}
            <Box mb={4}>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Description:
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.primary.main, lineHeight: 1.6 }}>
                    {listing.description}
                </Typography>
            </Box>

            {/* Stats Row */}
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }}
                gap={3}
            >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconContainer bgColor={theme.palette.text.tan}>
                        <IconLocationMark />
                    </IconContainer>

                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Location:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: theme.palette.primary.main }}>
                            {listing.city}, {listing.province} {listing.postal_code}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="flex-start">

                    <IconContainer bgColor={theme.palette.text.tan}>
                        <IconBed />
                    </IconContainer>
                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Bedrooms:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: theme.palette.primary.main }}>
                            {listing.bedrooms}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconContainer bgColor={theme.palette.text.tan}>
                        <IconBath />
                    </IconContainer>
                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Bathrooms:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: theme.palette.primary.main }}>
                            {listing.bathrooms}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconContainer bgColor={theme.palette.text.tan}>
                        <IconSqft />
                    </IconContainer>
                    <Box>
                        <Typography variant="caption" sx={{ display: "block", mb: 0.2 }}>
                            Square Feet:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ color: theme.palette.primary.main }}>
                            {listing.square_feet}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Lightbox slider */}
            <Modal
                open={isOpen}
                onClose={() => setLightboxIndex(null)}
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.92)" } } }}
            >
                <Box sx={{ position: "relative", outline: "none", userSelect: "none" }}>

                    {/* Close */}
                    <IconButton
                        onClick={() => setLightboxIndex(null)}
                        sx={{
                            position: "absolute",
                            top: -48,
                            right: 0,
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                        }}
                    >
                        <IconClose />
                    </IconButton>

                    {/* Counter */}
                    {total > 1 && (
                        <Typography
                            variant="caption"
                            sx={{
                                position: "absolute",
                                top: -44,
                                left: 0,
                                color: "rgba(255,255,255,0.7)",
                            }}
                        >
                            {(lightboxIndex ?? 0) + 1} / {total}
                        </Typography>
                    )}

                    {/* Image */}
                    <Box
                        component="img"
                        src={lightboxIndex !== null ? allImages[lightboxIndex] : ""}
                        alt={`Property ${(lightboxIndex ?? 0) + 1}`}
                        sx={{
                            maxWidth: "90vw",
                            maxHeight: "85vh",
                            objectFit: "contain",
                            borderRadius: 2,
                            display: "block",
                        }}
                    />

                    {/* Prev / Next */}
                    {total > 1 && (
                        <>
                            <IconButton
                                onClick={prev}
                                sx={{
                                    position: "absolute",
                                    left: -56,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                                }}
                            >
                                <IconArrowLeft />
                            </IconButton>

                            <IconButton
                                onClick={next}
                                sx={{
                                    position: "absolute",
                                    right: -56,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                                }}
                            >
                                <IconArrowLeft style={{ transform: "rotate(180deg)" }} />
                            </IconButton>
                        </>
                    )}
                </Box>
            </Modal>
        </Paper>
    );
}
