import { useForm } from "@inertiajs/react";
import { useState } from "react";

type ListingProps = {
    listing: {
        id: number;
        title: string;
        description: string;
        price: number;
        location: string;
        bedrooms: number;
        bathrooms: number;
        square_feet: number;
        main_image?: { id: number; image_path: string };
        images?: { id: number; image_path: string }[];
    };
};

export default function EditListing({ listing }: { listing: ListingProps["listing"] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        square_feet: listing.square_feet,
        main_image: null as File | null,
        gallery_images: [] as File[],
        remove_images: [] as number[], // ✅ Track images to remove
    });

    const [previewMainImage, setPreviewMainImage] = useState<string | null>(listing.main_image?.image_path || null);
    const [previewGalleryImages, setPreviewGalleryImages] = useState<{ id?: number; file?: File; url: string }[]>(
        listing.images?.map((img) => ({ id: img.id, url: img.image_path })) || []
    );

    // ✅ Handle Main Image Change
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setData("main_image", file);
            setPreviewMainImage(URL.createObjectURL(file)); // ✅ Preview New Image
        }
    };

    // ✅ Remove Main Image
    const removeMainImage = () => {
        setData("main_image", null);
        setPreviewMainImage(null);
    };

    // ✅ Handle Gallery Image Upload
    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setData("gallery_images", [...data.gallery_images, ...filesArray]);

            const newPreviews = filesArray.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));

            setPreviewGalleryImages([...previewGalleryImages, ...newPreviews]);
        }
    };

    // ✅ Remove Existing or Newly Uploaded Gallery Image
    const removeGalleryImage = (index: number) => {
        const updatedImages = [...previewGalleryImages];

        // ✅ If it's an existing image, mark for deletion
        if (updatedImages[index].id) {
            setData("remove_images", [...data.remove_images, updatedImages[index].id as number]);
        }

        // ✅ Remove from preview & form data
        updatedImages.splice(index, 1);
        setPreviewGalleryImages(updatedImages);
    };

    // ✅ Handle Form Submission
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/listings/${listing.id}/update`, { forceFormData: true }); // ✅ Send as FormData
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>

            <form onSubmit={submit} encType="multipart/form-data">
                {/* Standard Fields */}
                <input type="text" placeholder="Title" value={data.title} onChange={(e) => setData("title", e.target.value)} className="w-full p-2 border rounded mb-2" />
                {errors.title && <p className="text-red-500">{errors.title}</p>}

                <textarea placeholder="Description" value={data.description} onChange={(e) => setData("description", e.target.value)} className="w-full p-2 border rounded mb-2"></textarea>
                {errors.description && <p className="text-red-500">{errors.description}</p>}

                <input type="number" placeholder="Price" value={data.price} onChange={(e) => setData("price", e.target.value)} className="w-full p-2 border rounded mb-2" />
                {errors.price && <p className="text-red-500">{errors.price}</p>}

                <input type="text" placeholder="Location" value={data.location} onChange={(e) => setData("location", e.target.value)} className="w-full p-2 border rounded mb-2" />
                {errors.location && <p className="text-red-500">{errors.location}</p>}

                {/* Bedrooms Field */}
                <input type="number" placeholder="Bedrooms" value={data.bedrooms} onChange={(e) => setData("bedrooms", parseInt(e.target.value) || 1)} className="w-full p-2 border rounded mb-2" />
                {errors.bedrooms && <p className="text-red-500">{errors.bedrooms}</p>}

                {/* Bathrooms Field */}
                <input type="number" placeholder="Bathrooms" value={data.bathrooms} onChange={(e) => setData("bathrooms", parseInt(e.target.value) || 1)} className="w-full p-2 border rounded mb-2" />
                {errors.bathrooms && <p className="text-red-500">{errors.bathrooms}</p>}

                {/* ✅ Main Image Upload */}
                <div>
                    <label className="block font-semibold mt-4">Main Image:</label>
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="w-full p-2 border rounded mb-2" />
                    {previewMainImage && (
                        <div className="relative inline-block">
                            <img src={previewMainImage} alt="Main Image" className="w-full h-32 object-cover mt-2 rounded-lg" />
                            <button type="button" onClick={removeMainImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                                ❌
                            </button>
                        </div>
                    )}
                    {errors.main_image && <p className="text-red-500">{errors.main_image}</p>}
                </div>

                {/* ✅ Gallery Images Upload */}
                <div>
                    <label className="block font-semibold mt-4">Gallery Images:</label>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="w-full p-2 border rounded mb-2" />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {previewGalleryImages.map((image, index) => (
                            <div key={index} className="relative inline-block">
                                <img src={image.url} alt="Gallery" className="w-16 h-16 object-cover rounded-lg" />
                                <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors.gallery_images && <p className="text-red-500">{errors.gallery_images}</p>}
                </div>

                {/* ✅ Submit Button */}
                <button type="submit" disabled={processing} className="w-full bg-blue-600 text-white p-2 rounded mt-2">
                    {processing ? "Updating..." : "Update Listing"}
                </button>
            </form>
        </div>
    );
}
