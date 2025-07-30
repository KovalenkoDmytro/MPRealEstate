import React from "react";
import {
    Box,
    Typography,
    ImageList,
    ImageListItem,
    IconButton,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/CloudUpload";

interface GalleryImagePreview {
    id?: number;
    file?: File;
    url: string;
}

interface ImagesState {
    previewMainImage: string | null;
    previewGalleryImages: GalleryImagePreview[];
    totalGalleryImages: number;
}

interface ImagesHandlers {
    handleMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeMainImage: () => void;
    handleGalleryImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeGalleryImage: (index: number) => void;
}

interface Props {
    images: ImagesState;
    handlers: ImagesHandlers;
    disableGalleryUpload?: boolean;
}

export default function ListingImagesSection({images, handlers, disableGalleryUpload,}: Props) {
    const {previewMainImage, previewGalleryImages, totalGalleryImages} = images;
    const {handleMainImageChange, removeMainImage, handleGalleryImagesChange, removeGalleryImage,} = handlers;

    return (
        <Box sx={{backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 1}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                📸 Images
            </Typography>

            {/* Main Image */}
            <Box sx={{mb: 3}}>
                <Typography variant="subtitle2" gutterBottom>
                    Main Image
                </Typography>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon/>}
                    sx={{mb: 2}}
                >
                    Upload Main Image
                    <input type="file" hidden accept="image/*" onChange={handleMainImageChange}/>
                </Button>

                {previewMainImage && (
                    <Box sx={{position: "relative", display: "inline-block", mt: 1}}>
                        <img
                            src={previewMainImage}
                            alt="Main Preview"
                            style={{
                                width: 160,
                                height: 110,
                                objectFit: "cover",
                                borderRadius: 8,
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={removeMainImage}
                            sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": {backgroundColor: "rgba(0,0,0,0.7)"},
                            }}
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                )}
            </Box>

            {/* Gallery Images */}
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    Gallery Images ({totalGalleryImages}/7)
                </Typography>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon/>}
                    disabled={disableGalleryUpload || previewGalleryImages.length >= 7}
                >
                    Upload Gallery Images
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChange}
                    />
                </Button>

                {/* Gallery Preview */}
                <ImageList cols={4} gap={8} sx={{mt: 2}}>
                    {previewGalleryImages.map((image, index) => (
                        <ImageListItem key={index} sx={{position: "relative"}}>
                            <img
                                src={image.url}
                                alt={`Gallery image ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => removeGalleryImage(index)}
                                sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    color: "white",
                                    "&:hover": {backgroundColor: "rgba(0,0,0,0.7)"},
                                }}
                            >
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Box>
    );
}
