import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import { listingService } from "@/services/listingService";
import { PropertyStatus } from "@/types";
import { imageService } from "@/services/imageService";
import ImagesSection from "@/components/listing/editing/ListingImagesSection";
import ListingDetails from "@/components/listing/editing/ListingDetails";

type GalleryImagePreview = {
    file?: File;
    url: string;
};

type ListingFormData = {
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    lot_size: number;
    property_type: string;
    year_built: number;
    has_garage: boolean;
    garage_spaces: number;
    has_basement: boolean;
    hoa_fees: number;
    property_taxes: number;
    status: PropertyStatus;
    price_reduced: boolean;
    keywords: string;

    // Upload-specific fields
    main_image: File | null;
    gallery_images: File[];
};

export default function CreateListing() {
    const [data, setData] = useState<ListingFormData>({
        title: "",
        description: "",
        price: 0,
        location: "",
        bedrooms: 1,
        bathrooms: 1,
        square_feet: 0,
        lot_size: 0,
        property_type: "",
        year_built: 0,
        has_garage: false,
        garage_spaces: 0,
        has_basement: false,
        hoa_fees: 0,
        property_taxes: 0,
        status: PropertyStatus.Available,
        price_reduced: false,
        keywords: "",
        main_image: null,
        gallery_images: [],
    });

    const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);
    const [previewGalleryImages, setPreviewGalleryImages] = useState<GalleryImagePreview[]>([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    /** Handle form inputs */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type, checked, value } = event.target;
        const val = type === "checkbox" ? checked : value;
        setData((prev) => ({ ...prev, [name]: val }));
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

        return formData;
    };

    /** Submit handler */
    const submit = async () => {
        setProcessing(true);

        try {
            const formData = buildFormData(data);
            const result = await listingService.createListing(formData);

            alert('CreateListing')

            // if (result.success) {
            //     window.location.href = "/seller/listings";
            // } else {
            //     setErrors(result.errors);
            // }
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Create Listing</h2>}>
            <Head title="Create Listing" />
            <div className="container mx-auto p-4">
                {/* Property, Financial & Features */}
                <ListingDetails data={data} handleChange={handleChange} />

                {/* Images */}
                <ImagesSection
                    images={{previewMainImage, previewGalleryImages, totalGalleryImages: previewGalleryImages.length,}}
                    handlers={{handleMainImageChange, removeMainImage, handleGalleryImagesChange, removeGalleryImage,}}
                    disableGalleryUpload={data.gallery_images.length >= 7}
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
