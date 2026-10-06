import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { useState } from "react";
import { listingService } from "@/services/listingService";
import { GalleryImagePreview, ListingFormFieldValue, ListingFormValues, PropertyStatus, ValidationErrors } from "@/types";
import { imageService } from "@/services/imageService";
import ImagesSection from "@/components/listing/editing/ListingImagesSection";
import ListingDetails from "@/components/listing/editing/ListingDetails";
import {useNotification} from "@/context/NotificationContext";
import { Box, Stack, Typography } from "@mui/material";
import SectionCard from "@/design/SectionCard";
import BackToButton from "@/components/common/BackToButton";
import { primary } from "@/design/tokens";
import Button from "@/components/common/Button";
import {
    MAX_GALLERY_IMAGES,
    resolveMaxImageSizeBytes,
    validateImageFile,
    validateImageFiles,
} from "@/helpers/imageUploadValidationHelper";

type CreateListingProps = {
    listingImageMaxBytes?: number;
};

export default function CreateListing({ listingImageMaxBytes }: CreateListingProps) {
    const maxImageSizeBytes = resolveMaxImageSizeBytes(listingImageMaxBytes);

    const [data, setData] = useState<ListingFormValues>({
        title: "",
        description: "",
        price: null,

        street_number: "",
        street_name: "",
        city: "",
        province: "",
        postal_code: "",
        country: "",
        latitude: null,
        longitude: null,

        bedrooms: null,
        bathrooms: null,
        square_feet: null,
        lot_size: null,
        property_type: "",
        year_built: null,
        has_garage: false,
        garage_spaces: null,
        has_basement: false,
        hoa_fees: null,
        property_taxes: null,
        status: PropertyStatus.Available,
        price_reduced: false,
        keywords: [],
        main_image: null,
        gallery_images: [],
    });

    const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);
    const [previewGalleryImages, setPreviewGalleryImages] = useState<GalleryImagePreview[]>([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const {showNotification, setRedirectNotification} = useNotification();

    /** Handle form inputs */
    const handleChange = (name: string, value: ListingFormFieldValue) => {
        setData((prev) => ({...prev, [name]: value}));
    };


    /** Handle main image upload */
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const message = validateImageFile(file, maxImageSizeBytes, "Main image");
        if (message) {
            showNotification(message, "error");
            setErrors((prev) => ({ ...prev, main_image: [message] }));
            e.target.value = "";
            return;
        }

        setErrors((prev) => ({ ...prev, main_image: undefined }));
        setData((prev) => ({...prev, main_image: file}));
        setPreviewMainImage(URL.createObjectURL(file));
    };

    /** Remove main image preview */
    const removeMainImage = () => {
        if (previewMainImage) imageService.revokePreview(previewMainImage);
        setData((prev) => ({...prev, main_image: null}));
        setPreviewMainImage(null);
    };

    /** Handle gallery images upload */
    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        const message = validateImageFiles(newFiles, maxImageSizeBytes, "Each gallery image");
        if (message) {
            showNotification(message, "error");
            e.target.value = "";
            return;
        }

        // Validate count
        if (!imageService.canAddImages(previewGalleryImages.length, newFiles.length, MAX_GALLERY_IMAGES)) {
            showNotification(`You can only upload up to ${MAX_GALLERY_IMAGES} images total.`, "error");
            e.target.value = "";
            return;
        }

        // Update data
        setData((prev) => ({
            ...prev,
            gallery_images: [...prev.gallery_images, ...newFiles],
        }));

        // Add previews
        const newPreviews = imageService.createPreviews(newFiles);
        setPreviewGalleryImages((prev) => [...prev, ...newPreviews]);
        e.target.value = "";
    };

    /** Remove gallery image by index */
    const removeGalleryImage = (index: number) => {
        const updatedPreviews = [...previewGalleryImages];
        updatedPreviews.splice(index, 1);

        const updatedFiles = [...data.gallery_images];
        updatedFiles.splice(index, 1);

        setPreviewGalleryImages(updatedPreviews);
        setData((prev) => ({...prev, gallery_images: updatedFiles}));
    };

    /** Build FormData for submission */
    const buildFormData = (data: ListingFormValues): FormData => {
        const formData = new FormData();

        // Gallery images
        data.gallery_images.forEach((file) => {
            formData.append("gallery_images[]", file);
        });

        // Main image
        if (data.main_image) {
            formData.append("main_image", data.main_image);
        }

        // Primitive fields
        Object.entries(data).forEach(([key, value]) => {
            if (!["gallery_images", "main_image"].includes(key) && value !== null && typeof value !== "object") {
                formData.append(key, String(value));
            }
        });


        if (Array.isArray(data.keywords)) {
            data.keywords.forEach((keyword) => {
                if (keyword.trim() !== "") {
                    formData.append("keywords[]", keyword);
                }
            });
        }

        return formData;
    };

    /** Submit handler */
    const submit = async () => {
        setProcessing(true);
        const formData = buildFormData(data);
        const result = await listingService.createListing(formData);

        if (result.success) {
            setRedirectNotification(result.message, "success");
            window.location.href = "/listings";
        } else {
            setErrors(result.errors);
            const errorMap = (result.errors ?? {}) as Record<string, string[]>;
            const mainImageError = result.errors?.main_image?.[0];
            const galleryError = Object.entries(errorMap)
                .find(([key]) => key.startsWith("gallery_images"))?.[1]?.[0];
            showNotification(mainImageError || galleryError || result.message, "error");
        }

        setProcessing(false);
    };

    return (
        <AuthenticatedLayout header="Create New Listing">
            <Box sx={{ maxWidth: 1040, mx: 'auto', py: { xs: 2, md: 0 } }}>
                <BackToButton label="Listings" fallbackHref={route("listings.index")} sx={{ mb: 3, color: 'common.white', '&:hover': { color: primary[200] } }} />
                <Box sx={{ mb: 4 }}>
                    <Typography component="h1" variant="h4" sx={{ color: 'common.white', fontWeight: 700, letterSpacing: '-0.03em', mb: 1 }}>Create your listing</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Share the details, add photos, and help buyers discover your property.</Typography>
                </Box>
                <Stack spacing={3}>
                    <ListingDetails data={data} errors={errors} handleChange={handleChange} />

                    <ImagesSection
                        images={{previewMainImage, previewGalleryImages, totalGalleryImages: previewGalleryImages.length,}}
                        handlers={{handleMainImageChange, removeMainImage, handleGalleryImagesChange, removeGalleryImage,}}
                        disableGalleryUpload={data.gallery_images.length >= MAX_GALLERY_IMAGES}
                        errors={errors?.main_image?.[0]}
                    />

                    <SectionCard tone="elevated" sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                            <Typography fontWeight={700}>Ready to list your property?</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Review your details and photos before creating your listing.</Typography>
                        </Box>
                        <Box sx={{ flexShrink: 0 }}>
                            <Button
                                version={"primary"}
                                text={processing ? "Creating..." : "Create Listing"}
                                disabled={processing}
                                onClick={submit}
                            />
                        </Box>
                    </SectionCard>
                </Stack>
            </Box>
        </AuthenticatedLayout>
    );
}
