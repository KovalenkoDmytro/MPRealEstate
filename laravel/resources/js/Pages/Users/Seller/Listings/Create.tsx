import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function CreateListing() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        bedrooms: 1,
        bathrooms: 1,
        square_feet: "",
        lot_size: "",
        property_type: "",
        year_built: "",
        has_garage: false,
        garage_spaces: "",
        has_basement: false,
        hoa_fees: "",
        property_taxes: "",
        status: "available",
        price_reduced: false,
        keywords: "",
    });

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);
    const [previewGalleryImages, setPreviewGalleryImages] = useState<{ file: File; url: string }[]>([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value, checked } = e.target;
        const val = type === "checkbox" ? checked : value;
        setForm(prev => ({ ...prev, [name]: val }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            setMainImage(file);
            setPreviewMainImage(URL.createObjectURL(file));
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setGalleryImages(prev => [...prev, ...filesArray]);

            const newPreviews = filesArray.map(file => ({
                file,
                url: URL.createObjectURL(file),
            }));

            setPreviewGalleryImages(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        const updated = [...galleryImages];
        const previews = [...previewGalleryImages];
        updated.splice(index, 1);
        previews.splice(index, 1);
        setGalleryImages(updated);
        setPreviewGalleryImages(previews);
    };

    const removeMainImage = () => {
        setMainImage(null);
        setPreviewMainImage(null);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        if (mainImage) formData.append("main_image", mainImage);
        galleryImages.forEach((file, idx) => {
            formData.append("gallery_images[]", file);
        });

        try {
            const response = await fetch(route('seller.listings.store'), {
                method: "POST",
                credentials: "same-origin",

                headers: {
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                    "Accept": "application/json"
                },
                body: formData,
            });

            if (response.ok) {
                window.location.href = "/seller/listings";
                // if (response.status === 422) {
                //     const { errors } = await response.json();
                //     setErrors(errors);
                // } else {
                //     throw new Error("Something went wrong");
                // }
            } else {
                // window.location.href = "/listings";
            }
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Create a New Listing</h2>}>
            <Head title="Create a New Listing" />

            <div className="container mx-auto p-4">
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-8">

                    {/* 🏠 Property Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">🏠 Property Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Title</label>
                                <input name="title" type="text" value={form.title} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Location</label>
                                <input name="location" type="text" value={form.location} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} className="w-full textarea textarea-bordered" rows={4} />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Property Type</label>
                                <select name="property_type" value={form.property_type} onChange={handleChange} className="w-full select select-bordered">
                                    <option value="">Select Type</option>
                                    <option value="house">House</option>
                                    <option value="condo">Condo</option>
                                    <option value="townhouse">Townhouse</option>
                                    <option value="land">Land</option>
                                    <option value="multi-family">Multi-family</option>
                                    <option value="farm">Farm</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Year Built</label>
                                <input name="year_built" type="number" value={form.year_built} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Bedrooms</label>
                                <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Bathrooms</label>
                                <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Square Feet</label>
                                <input name="square_feet" type="number" value={form.square_feet} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Lot Size</label>
                                <input name="lot_size" type="number" value={form.lot_size} onChange={handleChange} className="w-full input input-bordered" />
                            </div>
                        </div>
                    </div>

                    {/* 💰 Financial Info */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">💰 Financial Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Price</label>
                                <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">HOA Fees</label>
                                <input name="hoa_fees" type="number" value={form.hoa_fees} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Property Taxes</label>
                                <input name="property_taxes" type="number" value={form.property_taxes} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Status</label>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">Keywords</label>
                                <input name="keywords" type="text" value={form.keywords} onChange={handleChange} className="w-full input input-bordered" />
                            </div>
                        </div>
                    </div>

                    {/* 🧱 Features */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">🧱 Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="has_garage" checked={form.has_garage} onChange={handleChange} className="checkbox" />
                                <label className="font-medium">Has Garage</label>
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Garage Spaces</label>
                                <input name="garage_spaces" type="number" value={form.garage_spaces} onChange={handleChange} className="w-full input input-bordered" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="has_basement" checked={form.has_basement} onChange={handleChange} className="checkbox" />
                                <label className="font-medium">Has Basement</label>
                            </div>
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
                            <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="file-input w-full" />
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {previewGalleryImages.map((image, index) => (
                                    <div key={index} className="relative inline-block">
                                        <img src={image.url} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                                        <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">❌</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ✅ Submit */}
                    <div className="text-end">
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                            {processing ? "Creating..." : "Create Listing"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
