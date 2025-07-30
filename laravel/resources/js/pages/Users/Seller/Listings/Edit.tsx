import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useTransition } from "react";
import { RealEstateListing } from "@/types";
import ListingDetails from "@/components/listing/editing/ListingDetails";
import ImagesSection from "@/components/listing/editing/ListingImagesSection";

export default function EditListing({ listing }: { listing: RealEstateListing }) {
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

    const [previewMainImage, setPreviewMainImage] = useState<string | null>(
        listing.main_image?.image_path || null
    );
    const [previewGalleryImages, setPreviewGalleryImages] = useState<
        { id?: number; file?: File; url: string }[]
    >(
        listing.images
            ?.filter((img) => !img.is_main)
            .map((img) => ({ id: img.id, url: img.image_path })) || []
    );

    const [removeMainImageFlag, setRemoveMainImageFlag] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // ==========================
    // Handlers
    // ==========================

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, type, checked, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? Number(value) || 0 : value,
        }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({ ...prev, main_image: file }));
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };

    const removeMainImage = () => {
        setData((prev) => ({ ...prev, main_image: null }));
        setPreviewMainImage(null);
        setRemoveMainImageFlag(true);
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        if (previewGalleryImages.length + newFiles.length > 7) {
            alert("You can only upload up to 7 images total.");
            return;
        }

        setData((prev) => ({
            ...prev,
            gallery_images: [...prev.gallery_images, ...newFiles],
        }));

        const newPreviews = newFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setPreviewGalleryImages((prev) => [...prev, ...newPreviews]);
    };

    const removeGalleryImage = (index: number) => {
        setPreviewGalleryImages((prev) => {
            const updated = [...prev];
            const removed = updated[index];
            if (removed.id) {
                setData((prevData) => ({
                    ...prevData,
                    remove_images: [...prevData.remove_images, removed.id!],
                }));
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(() => {
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

            fetch(route("seller.listings.update", { listing: listing.id }), {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": (
                        document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
                    )?.content || "",
                    Accept: "application/json",
                    "X-HTTP-Method-Override": "PUT",
                },
                body: formData,
            })
                .then(async (res) => {
                    if (res.ok) {
                        window.location.href = "/seller/listings";
                    } else if (res.status === 422) {
                        const json = await res.json();
                        setErrors(json.errors);
                    } else {
                        console.error("Unexpected error", res);
                    }
                })
                .catch((err) => {
                    console.error("Submission failed", err);
                });
        });
    };

    // ==========================
    // Render
    // ==========================
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Listing</h2>}>
            <Head title="Edit Listing" />
            <div className="container mx-auto p-4">
                <div className="mt-4">
                    <Link href={route("seller.listings.index")} className="text-blue-500">
                        🔙 Back to Listings
                    </Link>
                </div>

                <form onSubmit={submit} encType="multipart/form-data" className="space-y-8">
                    {/* Property, Financial & Features */}
                    <ListingDetails data={data} handleChange={handleChange} />

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
