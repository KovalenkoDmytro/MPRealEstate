import React from "react";
import { Box, Grid, Typography, Card, CardMedia } from "@mui/material";

interface ImageGalleryProps {
    mainImage: { image_path: string } | null;
    images: Array<{ id: number; image_path: string }>;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ mainImage, images }) => {
    return (
        <Box maxWidth="800px" mx="auto">
            {/* Main Image */}
            {mainImage ? (
                <Card sx={{ borderRadius: 2, boxShadow: 3, mb: 2 }}>
                    <CardMedia
                        component="img"
                        height="280"
                        image={mainImage.image_path}
                        alt="Main Image"
                        sx={{ objectFit: "cover" }}
                    />
                </Card>
            ) : (
                <Box
                    height={280}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="grey.200"
                    borderRadius={2}
                >
                    <Typography variant="body2" color="textSecondary">
                        No Image Available
                    </Typography>
                </Box>
            )}

            {/* Gallery Images */}
            {images && images.length > 0 && (
                <Grid container spacing={2} mt={1}>
                    {images.map((img) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={img.id}>
                            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                                <CardMedia
                                    component="img"
                                    height="100"
                                    image={img.image_path}
                                    alt="Gallery"
                                    sx={{ objectFit: "cover" }}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
