import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";
import { RealEstateListing, PropertyStatus } from "@/types";
import ListingDetails from "@/components/listing/editing/ListingDetails";
import ImagesSection from "@/components/listing/editing/ListingImagesSection";
import { listingService } from "@/services/listingService";
import { imageService } from "@/services/imageService";

type GalleryImagePreview = {
    id?: number;
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
    remove_images: number[];
};

export default function EditListing({ listing }: { listing: RealEstateListing }) {
    const [data, setData] = useState<ListingFormData>({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price || 0,
        location: listing.location || "",
        bedrooms: listing.bedrooms || 1,
        bathrooms: listing.bathrooms || 1,
        square_feet: listing.square_feet || 0,
        lot_size: listing.lot_size || 0,
        property_type: listing.property_type || "",
        year_built: listing.year_built || 0,
        has_garage: listing.has_garage || false,
        garage_spaces: listing.garage_spaces || 0,
        has_basement: listing.has_basement || false,
        hoa_fees: listing.hoa_fees || 0,
        property_taxes: listing.property_taxes || 0,
        status: listing.status || PropertyStatus.Available,
        price_reduced: listing.price_reduced || false,
        keywords: listing.keywords || "",
        main_image: null,
        gallery_images: [],
        remove_images: [],
    });

    const [previewMainImage, setPreviewMainImage] = useState<string | null>(listing.main_image.image_path);

    const initialGalleryImages: GalleryImagePreview[] =
        listing.images?.filter((img) => !img.is_main).map((img) => ({ id: img.id, url: img.image_path })) || [];

    const [previewGalleryImages, setPreviewGalleryImages] = useState<GalleryImagePreview[]>(initialGalleryImages);
    const [removeMainImageFlag, setRemoveMainImageFlag] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type, checked, value } = event.target;
        const val = type === "checkbox" ? checked : value;
        setData((prev) => ({ ...prev, [name]: val }));
    };

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

    const buildFormData = (data: ListingFormData, removeMainImageFlag: boolean): FormData => {
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

        return formData;
    };

    const submit = async () => {
        setProcessing(true);

        try {
            const formData = buildFormData(data, removeMainImageFlag);
            const result = await listingService.updateSellerListing(listing.id, formData);

            if (result.success) {
                window.location.href = "/seller/listings";
            } else {
                setErrors(result.errors);
            }
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Listing</h2>}>
            <Head title="Edit Listing" />
            <div className="container mx-auto p-4">
                <div className="mt-4">
                    <Link href={route("listings.index")} className="text-blue-500">
                        🔙 Back to Listings
                    </Link>
                </div>

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
                        {processing ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
