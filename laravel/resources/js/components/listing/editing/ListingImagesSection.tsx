import {useRef} from "react";
import {
    Box,
    Typography,
    ImageList,
    ImageListItem,
    IconButton, Alert, Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "@/theme";
import SectionCard from "@/design/SectionCard";
import { neutral, primary, radius } from "@/design/tokens";
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
        <SectionCard tone="elevated" sx={{ p: { xs: 2.5, md: 3.5 }, width: '100%', boxSizing: 'border-box' }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 3 }}>
                <Box sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: radius.md, bgcolor: primary[50], color: 'primary.main', display: 'grid', placeItems: 'center' }}><IconUpload /></Box>
                <Box>
                    <Typography component="h2" variant="h6" fontWeight={700}>Property photos</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Choose a cover image, then add more photos to show what makes your property special.</Typography>
                </Box>
            </Stack>
            <Box sx={{ mb: 3, p: { xs: 2, md: 2.5 }, border: `1px dashed ${neutral[300]}`, borderRadius: radius.md, bgcolor: neutral[50] }}>
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
                    fullWidth={false}
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
                        <Box component="img" src={previewMainImage} alt="Main Preview" sx={{ display: 'block', width: '100%', height: { xs: 220, md: 340 }, objectFit: 'cover', borderRadius: radius.md }} />
                    </Box>
                )}
            </Box>


            <Box sx={{ p: { xs: 2, md: 2.5 }, border: `1px dashed ${neutral[300]}`, borderRadius: radius.md, bgcolor: neutral[50] }}>
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
                    fullWidth={false}
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
                <ImageList gap={12} sx={{ mt: 2, mb: 0, gridTemplateColumns: { xs: '1fr !important', sm: 'repeat(2, 1fr) !important', md: 'repeat(3, 1fr) !important' } }}>
                    {previewGalleryImages.map((image, index) => (
                        <ImageListItem key={index} sx={{position: "relative"}}>
                            <img
                                src={image.url}
                                alt={`Gallery image ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: 180,
                                    objectFit: "cover",
                                    borderRadius: theme.shape.borderRadius,
                                    border: `1px solid ${theme.palette.border.main}`,
                                }}
                            />
                            <IconButton
                                aria-label={`Remove gallery image ${index + 1}`}
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
        </SectionCard>
    );
}
