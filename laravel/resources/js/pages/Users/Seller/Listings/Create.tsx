import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import { listingService } from "@/services/listingService";
import { PropertyStatus } from "@/types";
import { imageService } from "@/services/imageService";
import ImagesSection from "@/components/listing/editing/ListingImagesSection";
import ListingDetails from "@/components/listing/editing/ListingDetails";
import {ValidationErrors} from "@/types/validationErrors";
import {useNotification} from "@/context/NotificationContext";

type GalleryImagePreview = {
    file?: File;
    url: string;
};

type ListingFormData = {
    title: string;
    description: string;
    price: number|null;
    location: string;
    bedrooms: number | null;
    bathrooms: number | null;
    square_feet: number|null;
    lot_size: number|null;
    property_type: string;
    year_built: number|null;
    has_garage: boolean;
    garage_spaces: number|null;
    has_basement: boolean;
    hoa_fees: number|null;
    property_taxes: number|null;
    status: PropertyStatus;
    price_reduced: boolean;
    keywords: string[];

    // Upload-specific fields
    main_image: File | null;
    gallery_images: File[];
};

export default function CreateListing() {
    const [data, setData] = useState<ListingFormData>({
        title: "",
        description: "",
        price: null,
        location: "",
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
    const { showNotification, setRedirectNotification } = useNotification();

    /** Handle form inputs */
    const handleChange = (name: string, value: string[]| string | number | boolean) => {
        setData((prev) => ({ ...prev, [name]: value }));
    };


    /** Handle main image upload */
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({ ...prev, main_image: file }));
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };

    /** Remove main image preview */
    const removeMainImage = () => {
        if (previewMainImage) imageService.revokePreview(previewMainImage);
        setData((prev) => ({ ...prev, main_image: null }));
        setPreviewMainImage(null);
    };

    /** Handle gallery images upload */
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

    /** Remove gallery image by index */
    const removeGalleryImage = (index: number) => {
        const updatedPreviews = [...previewGalleryImages];
        updatedPreviews.splice(index, 1);

        const updatedFiles = [...data.gallery_images];
        updatedFiles.splice(index, 1);

        setPreviewGalleryImages(updatedPreviews);
        setData((prev) => ({ ...prev, gallery_images: updatedFiles }));
    };

    /** Build FormData for submission */
    const buildFormData = (data: ListingFormData): FormData => {
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

        if(result.success){
            setRedirectNotification(result.message, "success");
            window.location.href = "/listings";
        }else {
            setErrors(result.errors);
            showNotification(result.message,"error")
        }

        setProcessing(false);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Create Listing</h2>}>
            <Head title="Create Listing" />
            <div className="container mx-auto p-4">
                {/* Property, Financial & Features */}
                <ListingDetails data={data} errors={errors} handleChange={handleChange} />

                {/* Images */}
                <ImagesSection
                    images={{previewMainImage, previewGalleryImages, totalGalleryImages: previewGalleryImages.length,}}
                    handlers={{handleMainImageChange, removeMainImage, handleGalleryImagesChange, removeGalleryImage,}}
                    disableGalleryUpload={data.gallery_images.length >= 7}
                    errors={errors?.main_image?.[0]}
                />

                {/* Submit Button */}
                <div className="text-end mt-8">
                    <button
                        onClick={submit}
                        disabled={processing}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                    >
                        {processing ? "Creating..." : "Create Listing"}
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
