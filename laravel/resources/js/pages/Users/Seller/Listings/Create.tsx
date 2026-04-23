import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { useState } from "react";
import { listingService } from "@/services/listingService";
import { GalleryImagePreview, ListingFormFieldValue, ListingFormValues, PropertyStatus, ValidationErrors } from "@/types";
import { imageService } from "@/services/imageService";
import ImagesSection from "@/components/listing/editing/ListingImagesSection";
import ListingDetails from "@/components/listing/editing/ListingDetails";
import {useNotification} from "@/context/NotificationContext";
import {Stack} from "@mui/material";
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
            <Stack spacing={4}>
                <ListingDetails data={data} errors={errors} handleChange={handleChange} />

                <ImagesSection
                    images={{previewMainImage, previewGalleryImages, totalGalleryImages: previewGalleryImages.length,}}
                    handlers={{handleMainImageChange, removeMainImage, handleGalleryImagesChange, removeGalleryImage,}}
                    disableGalleryUpload={data.gallery_images.length >= MAX_GALLERY_IMAGES}
                    errors={errors?.main_image?.[0]}
                />

                <Button
                    version={"primary"}
                    text={processing ? "Creating..." : "Create Listing"}
                    disabled={processing}
                    onClick={submit}
                />
            </Stack>
        </AuthenticatedLayout>
    );
}
