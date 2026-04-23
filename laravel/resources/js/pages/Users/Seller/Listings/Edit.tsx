import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { useState } from "react";
import { EditableListingFormValues, GalleryImagePreview, ListingFormFieldValue, PropertyStatus, RealEstateListing } from "@/types";
import ListingDetails from "@/components/listing/editing/ListingDetails";
import ImagesSection from "@/components/listing/editing/ListingImagesSection";
import { listingService } from "@/services/listingService";
import { imageService } from "@/services/imageService";
import ConfirmDialog from "@/components/ConfirmDialog";
import {useNotification} from "@/context/NotificationContext";
import Button from "@/components/common/Button";
import {Grid, Stack} from "@mui/material";
import BackToButton from "@/components/common/BackToButton";

export default function EditListing({ listing }: { listing: RealEstateListing }) {
    const [data, setData] = useState<EditableListingFormValues>({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price || null,
        bedrooms: listing.bedrooms || 1,
        bathrooms: listing.bathrooms || 1,
        square_feet: listing.square_feet || null,
        lot_size: listing.lot_size || null,
        property_type: listing.property_type || "",
        year_built: listing.year_built || 1950,
        has_garage: listing.has_garage || false,
        garage_spaces: listing.garage_spaces || null,
        has_basement: listing.has_basement || false,
        hoa_fees: listing.hoa_fees || null,
        property_taxes: listing.property_taxes || null,
        status: listing.status || PropertyStatus.Available,
        price_reduced: listing.price_reduced || false,
        keywords: listing.keywords || [],
        street_number: listing.street_number || "",
        street_name: listing.street_name || "",
        city: listing.city || "",
        province: listing.province || "",
        postal_code: listing.postal_code || "",
        country: listing.country || "",
        latitude: listing.latitude || null,
        longitude: listing.longitude || null,
        main_image: null,
        gallery_images: [],
        remove_images: [],
    });
    const [previewMainImage, setPreviewMainImage] = useState<string | null>(listing.main_image?.image_path ?? null);
    const initialGalleryImages: GalleryImagePreview[] =
        listing.images?.filter((img) => !img.is_main).map((img) => ({ id: img.id, url: img.image_path })) || [];
    const [previewGalleryImages, setPreviewGalleryImages] = useState<GalleryImagePreview[]>(initialGalleryImages);
    const [removeMainImageFlag, setRemoveMainImageFlag] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { showNotification, setRedirectNotification } = useNotification();


    const handleChange = (name: string, value: ListingFormFieldValue) => {
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeactivateListing = async () =>{
        setProcessing(true);

        try {
            const result = await listingService.deactivateListing(listing.id);

            if (result.success) {
                alert(result.data.message);
            } else {
                setErrors(result.errors);
            }
        } catch {
        } finally {
            setProcessing(false);
        }
    }
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({ ...prev, main_image: file }));
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };
    const removeMainImage = () => {
        if (previewMainImage) imageService.revokePreview(previewMainImage);
        setData((prev) => ({ ...prev, main_image: null }));
        setPreviewMainImage(null);
        setRemoveMainImageFlag(true);
    };
    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);

        // Validate count
        if (!imageService.canAddImages(previewGalleryImages.length, newFiles.length)) {
            alert("You can only upload up to 7 images total.");
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
    };
    const removeGalleryImage = (index: number) => {
        const { updatedPreviews, updatedRemoveIds } = imageService.removeGalleryImage(
            index,
            previewGalleryImages,
            data.remove_images
        );

        setPreviewGalleryImages(updatedPreviews);
        setData((prev) => ({ ...prev, remove_images: updatedRemoveIds }));
    };
    const buildFormData = (data: EditableListingFormValues, removeMainImageFlag: boolean): FormData => {
        const formData = new FormData();

        // Gallery images
        data.gallery_images.forEach((file) => {
            formData.append("gallery_images[]", file);
        });

        // Images to remove
        data.remove_images.forEach((id) => {
            formData.append("remove_images[]", id.toString());
        });

        // Main image
        if (data.main_image) {
            formData.append("main_image", data.main_image);
        }

        // Primitive fields
        Object.entries(data).forEach(([key, value]) => {
            if (!["gallery_images", "remove_images", "main_image"].includes(key) && value !== null && typeof value !== "object") {
                formData.append(key, String(value));
            }
        });

        // Remove main flag
        if (removeMainImageFlag && !data.main_image) {
            formData.append("remove_main_image", "true");
        }

        if (Array.isArray(data.keywords)) {
            data.keywords.forEach((keyword) => {
                if (keyword.trim() !== "") {
                    formData.append("keywords[]", keyword);
                }
            });
        }

        return formData;
    };
    const submit = async () => {
        setProcessing(true);
        const formData = buildFormData(data, removeMainImageFlag);
        const result = await listingService.updateListing(listing.id, formData);

        if (result.success) {
            setRedirectNotification(result.message, "success");
            window.location.href = "/listings";
        } else {
            setErrors(result.errors);
            showNotification(result.message,"error");
        }
        setProcessing(false);
    };



    return (
        <AuthenticatedLayout header="Edit Listing">

            <Grid container spacing={4}>

                <BackToButton label="Listings" fallbackHref={route("listings.index")} />


                {/* Property, Financial & Features */}
                <ListingDetails data={data} errors={errors} handleChange={handleChange} />

                {/* Images */}
                <ImagesSection
                    images={{previewMainImage, previewGalleryImages, totalGalleryImages: previewGalleryImages.length,}}
                    handlers={{handleMainImageChange, removeMainImage, handleGalleryImagesChange, removeGalleryImage,}}
                    disableGalleryUpload={data.gallery_images.length >= 7}
                />

                {/* Submit Button */}
                <Stack direction="row" justifyContent="flex-end" spacing={2} width={"100%"} >
                    <Button
                        text={processing ? "Deleting..." : "Delete listing"}
                        onClick={() => setConfirmOpen(true)}
                        disabled={processing}
                        version="outline"
                    />

                    <Button
                        text={processing ? "Saving..." : "Save Changes"}
                        onClick={submit}
                        disabled={processing}
                    />

                </Stack>

                <ConfirmDialog
                    open={confirmOpen}
                    title="Deactivate this listing?"
                    description={
                        <>
                            This will <b>archive</b> the listing (soft delete) and remove non-main gallery images.
                            You can restore it later from the admin if needed.
                        </>
                    }
                    confirmLabel="Deactivate"
                    cancelLabel="Cancel"
                    confirmColor="error"
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={handleDeactivateListing} // dialog will await this and close on success
                />
            </Grid>
        </AuthenticatedLayout>
    );
}
