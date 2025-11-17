import React from "react";
import {
    Box,
    Typography,
    ImageList,
    ImageListItem,
    IconButton,
    Button, Alert,
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
    errors?: string;
}

export default function ListingImagesSection({images, handlers, disableGalleryUpload, errors}: Props) {
    const {previewMainImage, previewGalleryImages, totalGalleryImages} = images;
    const {handleMainImageChange, removeMainImage, handleGalleryImagesChange, removeGalleryImage,} = handlers;

    return (
        <Box sx={{backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 1}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                📸 Images
            </Typography>

            <Box sx={{mb: 3}}>
                <Typography variant="subtitle2" gutterBottom>
                    Main Image
                </Typography>
                {errors &&
                    <Alert variant="outlined" severity="error" sx={{mb: 2}}>
                        {errors}
                    </Alert>
                }
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon/>}
                >
                    Upload Main Image
                    <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleMainImageChange}
                    />
                </Button>

                {/* --- ADDED HELPER TEXT FOR MAIN IMAGE --- */}
                <Typography variant="caption" color="textSecondary" sx={{display: "block", mt: 1}}>
                    Must be a JPG, PNG, or WEBP file. Max size: 4MB.
                </Typography>
                {/* --- END HELPER TEXT --- */}

                {previewMainImage && (
                    <Box sx={{position: "relative", display: "inline-block", mt: 2}}> {/* Added mt: 2 */}
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


            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    Gallery Images ({totalGalleryImages}/5)
                </Typography>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon/>}
                    disabled={disableGalleryUpload || previewGalleryImages.length >= 5}
                >
                    Upload Gallery Images
                    <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        multiple
                        onChange={handleGalleryImagesChange}
                    />
                </Button>

                <Typography variant="caption" color="textSecondary" sx={{display: "block", mt: 1}}>
                    You can upload a maximum of 5 images.
                    <br/>
                    Each file must be a JPG, PNG, or WEBP, and no larger than 4MB.
                </Typography>


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
