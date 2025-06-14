import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useTransition } from "react";
import {Listing} from "@/types";

export default function EditListing( { listing }: { listing: Listing }) {
    const [data, setData] = useState({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price || 0,
        location: listing.location || "",
        bedrooms: listing.bedrooms || 1,
        bathrooms: listing.bathrooms || 1,
        square_feet: listing.square_feet || "",
        lot_size: listing.lot_size || "",
        property_type: listing.property_type || "",
        year_built: listing.year_built || "",
        has_garage: listing.has_garage || false,
        garage_spaces: listing.garage_spaces || "",
        has_basement: listing.has_basement || false,
        hoa_fees: listing.hoa_fees || "",
        property_taxes: listing.property_taxes || "",
        status: listing.status || "available",
        price_reduced: listing.price_reduced || false,
        listed_at: listing.listed_at || "",
        keywords: listing.keywords || "",
        main_image: null as File | null,
        gallery_images: [] as File[],
        remove_images: [] as number[],
    });

    const [previewMainImage, setPreviewMainImage] = useState<string | null>(listing.main_image?.image_path || null);
    const [previewGalleryImages, setPreviewGalleryImages] = useState<{ id?: number; file?: File; url: string }[]>(
        listing.images
            ?.filter(img => !img.is_main) // exclude main image from gallery
            .map(img => ({ id: img.id, url: img.image_path })) || []
    );
    const [removeMainImageFlag, setRemoveMainImageFlag] = useState(false);

    const [isPending, startTransition] = useTransition();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const totalGalleryImages = previewGalleryImages.length;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type, checked, value } = e.target;
        setData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData(prev => ({ ...prev, main_image: file }));
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };

    const removeMainImage = () => {
        setData(prev => ({ ...prev, main_image: null }));
        setPreviewMainImage(null);
        setRemoveMainImageFlag(true);
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        const currentCount = previewGalleryImages.length;

        if (currentCount + newFiles.length > 7) {
            alert("You can only upload up to 7 images total.");
            return;
        }

        setData(prev => ({
            ...prev,
            gallery_images: [...prev.gallery_images, ...newFiles],
        }));

        const newPreviews = newFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setPreviewGalleryImages(prev => [...prev, ...newPreviews]);
    };

    const removeGalleryImage = (index: number) => {
        setPreviewGalleryImages(prev => {
            const updated = [...prev];
            const removed = updated[index];
            if (removed.id) {
                setData(prevData => ({
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
                    value.forEach(file => formData.append("gallery_images[]", file));
                } else if (key === "remove_images" && Array.isArray(value)) {
                    value.forEach(id => formData.append("remove_images[]", id.toString()));
                } else if (key === "main_image" && value) {
                    formData.append("main_image", value);
                } else if (typeof value !== "object" && value !== null) {
                    formData.append(key, String(value));
                }
            });

            //  Only if old image removed and no new one set
            if (removeMainImageFlag && !data.main_image) {
                formData.append("remove_main_image", "true");
            }

            fetch(route("seller.listings.update", { listing: listing.id }), {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                    "Accept": "application/json",
                    "X-HTTP-Method-Override": "PUT",
                },
                body: formData,
            })
                .then(async res => {
                    if (res.ok) {
                        window.location.href = "/seller/listings";
                    } else if (res.status === 422) {
                        const json = await res.json();
                        setErrors(json.errors);
                    } else {
                        console.error("Unexpected error", res);
                    }
                })
                .catch(err => {
                    console.error("Submission failed", err);
                });
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Edit Listing</h2>}>
            <Head title="Edit Listing" />

            <div className="container mx-auto p-4">
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-8">

                    {/* 🏠 Property Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">🏠 Property Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="title" value={data.title} onChange={handleChange} className="input input-bordered" placeholder="Title" />
                            <input name="location" value={data.location} onChange={handleChange} className="input input-bordered" placeholder="Location" />
                            <textarea name="description" value={data.description} onChange={handleChange} className="textarea textarea-bordered md:col-span-2" rows={4} placeholder="Description" />
                            <select name="property_type" value={data.property_type} onChange={handleChange} className="select select-bordered">
                                <option value="">Select Type</option>
                                <option value="house">House</option>
                                <option value="condo">Condo</option>
                                <option value="townhouse">Townhouse</option>
                                <option value="land">Land</option>
                                <option value="multi-family">Multi-family</option>
                                <option value="farm">Farm</option>
                            </select>
                            <input name="year_built" value={data.year_built} type="number" onChange={handleChange} className="input input-bordered" placeholder="Year Built" />
                            <input name="bedrooms" value={data.bedrooms} type="number" onChange={handleChange} className="input input-bordered" placeholder="Bedrooms" />
                            <input name="bathrooms" value={data.bathrooms} type="number" onChange={handleChange} className="input input-bordered" placeholder="Bathrooms" />
                            <input name="square_feet" value={data.square_feet} type="number" onChange={handleChange} className="input input-bordered" placeholder="Sq Ft" />
                            <input name="lot_size" value={data.lot_size} type="number" onChange={handleChange} className="input input-bordered" placeholder="Lot Size" />
                        </div>
                    </div>

                    {/* 💰 Financial Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">💰 Financial Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="price" value={data.price} type="number" onChange={handleChange} className="input input-bordered" placeholder="Price" />
                            <input name="hoa_fees" value={data.hoa_fees} type="number" onChange={handleChange} className="input input-bordered" placeholder="HOA Fees" />
                            <input name="property_taxes" value={data.property_taxes} type="number" onChange={handleChange} className="input input-bordered" placeholder="Property Taxes" />
                            <select name="status" value={data.status} onChange={handleChange} className="select select-bordered">
                                <option value="available">Available</option>
                                <option value="pending">Pending</option>
                                <option value="sold">Sold</option>
                            </select>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="price_reduced" checked={data.price_reduced} onChange={handleChange} className="checkbox" />
                                Price Reduced
                            </label>
                            <input name="listed_at" value={data.listed_at} type="date" onChange={handleChange} className="input input-bordered" />
                            <input name="keywords" value={data.keywords} onChange={handleChange} className="input input-bordered md:col-span-2" placeholder="Keywords" />
                        </div>
                    </div>

                    {/* 🧱 Features */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">🧱 Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="has_garage" checked={data.has_garage} onChange={handleChange} className="checkbox" />
                                Has Garage
                            </label>
                            <input name="garage_spaces" value={data.garage_spaces} type="number" onChange={handleChange} className="input input-bordered" placeholder="Garage Spaces" />
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="has_basement" checked={data.has_basement} onChange={handleChange} className="checkbox" />
                                Has Basement
                            </label>
                        </div>
                    </div>

                    {/* 📸 Media */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">📸 Images</h3>

                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Main Image</label>
                            <input type="file" accept="image/*" onChange={handleMainImageChange} className="file-input w-full" />
                            {previewMainImage && (
                                <div className="mt-2 relative inline-block">
                                    <img src={previewMainImage} alt="Preview" className="w-40 h-28 object-cover rounded-lg" />
                                    <button type="button" onClick={removeMainImage} className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2">❌</button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Gallery Images</label>
                            <p className="text-sm text-gray-500">
                                {totalGalleryImages} of 7 images selected
                            </p>
                            <input type="file" accept="image/*" disabled={previewGalleryImages.length >= 7} multiple onChange={handleGalleryImagesChange} className="file-input w-full" />
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {previewGalleryImages.map((image, index) => (
                                    <div key={index} className="relative inline-block">
                                        <img src={image.url} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                                        <button type="button"  disabled={data.gallery_images.length >= 7} onClick={() => removeGalleryImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">❌</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ✅ Submit */}
                    <div className="text-end">
                        <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
