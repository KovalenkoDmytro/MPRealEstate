import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {Head, Link} from "@inertiajs/react";
import React, {useState, useTransition} from "react";
import {RealEstateListing} from "@/types";
import ListingDetails from "@/components/listing/editing/ListingDetails";
import ImagesSection from "@/components/listing/editing/ListingImagesSection";
import {listingService} from "@/services/listingService";
import {imageService} from "@/services/imageService";


type GalleryImagePreview = {
    id?: number;
    file?: File;
    url: string;
};


export default function EditListing({listing}: { listing: RealEstateListing }) {
    // ==========================
    // State
    // ==========================
    const [data, setData] = useState({
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
        status: listing.status || "available",
        price_reduced: listing.price_reduced || false,
        keywords: listing.keywords || "",
        main_image: null as File | null,
        gallery_images: [] as File[],
        remove_images: [] as number[],
    });

    const [previewMainImage, setPreviewMainImage] = useState<string | null>(listing.main_image.image_path);

    const initialGalleryImages: GalleryImagePreview[] = listing.images
        ?.filter((img) => !img.is_main)
        .map((img) => ({id: img.id, url: img.image_path,})) || [];

    const [previewGalleryImages, setPreviewGalleryImages] = useState<GalleryImagePreview[]>(initialGalleryImages);
    const [removeMainImageFlag, setRemoveMainImageFlag] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string[]>>({});



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const {name, type, checked, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? Number(value) || 0 : value,
        }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({...prev, main_image: file}));
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };

    const removeMainImage = () => {
        if (previewMainImage) imageService.revokePreview(previewMainImage);
        setData((prev) => ({...prev, main_image: null}));
        setPreviewMainImage(null);
        setRemoveMainImageFlag(true);
    };


    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);

        // Validate count using service
        if (!imageService.canAddImages(previewGalleryImages.length, newFiles.length)) {
            alert("You can only upload up to 7 images total.");
            return;
        }

        // Update data state
        setData((prev) => ({
            ...prev,
            gallery_images: [...prev.gallery_images, ...newFiles],
        }));

        // Generate previews using service
        const newPreviews = imageService.createPreviews(newFiles);
        setPreviewGalleryImages((prev) => [...prev, ...newPreviews]);
    };


    const removeGalleryImage = (index: number) => {
        const {updatedPreviews, updatedRemoveIds} = imageService.removeGalleryImage(
            index,
            previewGalleryImages,
            data.remove_images
        );

        setPreviewGalleryImages(updatedPreviews);
        setData((prev) => ({...prev, remove_images: updatedRemoveIds}));
    };


    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(() => {
            (async () => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key === "gallery_images" && Array.isArray(value)) {
                        value.forEach((file) => formData.append("gallery_images[]", file));
                    } else if (key === "remove_images" && Array.isArray(value)) {
                        value.forEach((id) => formData.append("remove_images[]", id.toString()));
                    } else if (key === "main_image" && value) {
                        formData.append("main_image", value);
                    } else if (typeof value !== "object" && value !== null) {
                        formData.append(key, String(value));
                    }
                });

                if (removeMainImageFlag && !data.main_image) {
                    formData.append("remove_main_image", "true");
                }

                try {
                    const result = await listingService.updateSellerListing(listing.id, formData);

                    if (result.success) {
                        window.location.href = "/seller/listings";
                    } else {
                        setErrors(result.errors);
                    }
                } catch (error) {
                    console.error("Submission failed:", error);
                }
            })();
        });
    };


    // ==========================
    // Render
    // ==========================
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Listing</h2>}>
            <Head title="Edit Listing"/>
            <div className="container mx-auto p-4">
                <div className="mt-4">
                    <Link href={route("seller.listings.index")} className="text-blue-500">
                        🔙 Back to Listings
                    </Link>
                </div>

                <form onSubmit={submit} encType="multipart/form-data" className="space-y-8">
                    {/* Property, Financial & Features */}
                    <ListingDetails data={data} handleChange={handleChange}/>

                    {/* Images */}
                    <ImagesSection
                        images={{
                            previewMainImage,
                            previewGalleryImages,
                            totalGalleryImages: previewGalleryImages.length,
                        }}
                        handlers={{
                            handleMainImageChange,
                            removeMainImage,
                            handleGalleryImagesChange,
                            removeGalleryImage,
                        }}
                        disableGalleryUpload={data.gallery_images.length >= 7}
                    />

                    {/* Submit */}
                    <div className="text-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
