import {useRef} from "react";
import {
    Box,
    Typography,
    ImageList,
    ImageListItem,
    IconButton, Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "@/theme";
import Button from "@/components/common/Button";
import IconUpload from "@/icons/IconUpload";
import { ListingImageHandlers, ListingImagesState } from "@/types";
import { usePage } from "@inertiajs/react";
import type { PageProps } from "@/types/pageProps";
import {
    formatMaxImageSizeLabel,
    MAX_GALLERY_IMAGES,
    resolveMaxImageSizeBytes,
} from "@/helpers/imageUploadValidationHelper";

interface ListingImagesSectionProps {
    images: ListingImagesState;
    handlers: ListingImageHandlers;
    disableGalleryUpload?: boolean;
    errors?: string;
}

export default function ListingImagesSection({images, handlers, disableGalleryUpload, errors}: ListingImagesSectionProps) {
    const {previewMainImage, previewGalleryImages, totalGalleryImages} = images;
    const {handleMainImageChange, handleGalleryImagesChange, removeGalleryImage,} = handlers;
    const { listingImageMaxBytes } = usePage<PageProps & { listingImageMaxBytes?: number }>().props;
    const maxImageBytes = resolveMaxImageSizeBytes(listingImageMaxBytes);
    const maxImageMbLabel = formatMaxImageSizeLabel(maxImageBytes);

    const inputMainImageRef = useRef<HTMLInputElement>(null);
    const inputGlleryImagesRef = useRef<HTMLInputElement>(null);

    return (
        <Box sx={{
            p: theme.shape.padding,
            backgroundColor: theme.palette.background.white,
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.border.main}`,
            width: "100%",
        }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Images
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

                <input
                    ref={inputMainImageRef}
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleMainImageChange}
                />

                <Button
                    version="outline"
                    text={previewMainImage ? "Change Main Image" : "Upload Main Image"}
                    icon={<IconUpload/>}
                    onClick={() => {inputMainImageRef.current?.click()}}
                >

                </Button>

                {/* --- ADDED HELPER TEXT FOR MAIN IMAGE --- */}
                <Typography variant="caption" color="textSecondary" sx={{display: "block", mt: 1}}>
                    Must be a JPG, PNG, or WEBP file. Max size: {maxImageMbLabel}.
                </Typography>
                {/* --- END HELPER TEXT --- */}

                {previewMainImage && (
                    <Box mt={2}>
                        <img
                            src={previewMainImage}
                            alt="Main Preview"
                            style={{
                                width: "100%",
                                height: 510,
                                objectFit: "cover",
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.border.main}`,
                            }}
                        />
                    </Box>
                )}
            </Box>


            <Box >
                <Typography variant="subtitle2" gutterBottom>
                    Gallery Images ({totalGalleryImages}/{MAX_GALLERY_IMAGES})
                </Typography>
                <input
                    type="file"
                    ref={inputGlleryImagesRef}
                    hidden
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    multiple
                    onChange={handleGalleryImagesChange}
                />
                <Button
                    version="outline"
                    text="Upload Gallery Images"
                    icon={<IconUpload/>}
                    disabled={disableGalleryUpload || previewGalleryImages.length >= MAX_GALLERY_IMAGES}
                    onClick={() => {inputGlleryImagesRef.current?.click()}}
                >
                </Button>

                <Typography variant="caption" color="textSecondary" sx={{display: "block", mt: 1}}>
                    You can upload a maximum of {MAX_GALLERY_IMAGES} images.
                    <br/>
                    Each file must be a JPG, PNG, or WEBP, and no larger than {maxImageMbLabel}.
                </Typography>


                {/* Gallery Preview */}
                <ImageList cols={2} gap={20} sx={{mt: 2}}>
                    {previewGalleryImages.map((image, index) => (
                        <ImageListItem key={index} sx={{position: "relative"}}>
                            <img
                                src={image.url}
                                alt={`Gallery image ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: 280,
                                    objectFit: "cover",
                                    borderRadius: theme.shape.borderRadius,
                                    border: `1px solid ${theme.palette.border.main}`,
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
