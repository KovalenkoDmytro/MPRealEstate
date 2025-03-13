import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateListing() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        square_feet: 500,
        main_image: '', // ✅ New field for main image
        gallery_images: [] as string[], // ✅ New field for multiple gallery images
    });

    // ✅ Track dynamic image inputs
    const [imageInputs, setImageInputs] = useState<string[]>([]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/listings');
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create a New Listing</h2>

            <form onSubmit={submit}>
                {/* Text Inputs */}
                <input type="text" placeholder="Title" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full p-2 border rounded mb-2" />
                {errors.title && <p className="text-red-500">{errors.title}</p>}

                <textarea placeholder="Description" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full p-2 border rounded mb-2"></textarea>
                {errors.description && <p className="text-red-500">{errors.description}</p>}

                <input type="number" placeholder="Price" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full p-2 border rounded mb-2" />
                {errors.price && <p className="text-red-500">{errors.price}</p>}

                <input type="text" placeholder="Location" value={data.location} onChange={e => setData('location', e.target.value)} className="w-full p-2 border rounded mb-2" />
                {errors.location && <p className="text-red-500">{errors.location}</p>}

                <input type="number" placeholder="Bedrooms" value={data.bedrooms} onChange={e => setData('bedrooms', parseInt(e.target.value))} className="w-full p-2 border rounded mb-2" />
                {errors.bedrooms && <p className="text-red-500">{errors.bedrooms}</p>}

                <input type="number" placeholder="Bathrooms" value={data.bathrooms} onChange={e => setData('bathrooms', parseInt(e.target.value))} className="w-full p-2 border rounded mb-2" />
                {errors.bathrooms && <p className="text-red-500">{errors.bathrooms}</p>}

                <input type="number" placeholder="Square Feet" value={data.square_feet} onChange={e => setData('square_feet', parseInt(e.target.value))} className="w-full p-2 border rounded mb-2" />
                {errors.square_feet && <p className="text-red-500">{errors.square_feet}</p>}

                {/* ✅ Main Image Input */}
                <input type="text" placeholder="Main Image URL" value={data.main_image} onChange={e => setData('main_image', e.target.value)} className="w-full p-2 border rounded mb-2" />
                {errors.main_image && <p className="text-red-500">{errors.main_image}</p>}

                {/* ✅ Gallery Images (Multiple) */}
                <div className="mb-2">
                    <label className="block font-medium">Gallery Images (URLs)</label>
                    {imageInputs.map((_, index) => (
                        <div key={index} className="flex space-x-2 mt-2">
                            <input
                                type="text"
                                placeholder={`Image URL #${index + 1}`}
                                value={data.gallery_images[index] || ''}
                                onChange={e => {
                                    const updatedImages = [...data.gallery_images];
                                    updatedImages[index] = e.target.value;
                                    setData('gallery_images', updatedImages);
                                }}
                                className="w-full p-2 border rounded"
                            />
                            <button type="button" onClick={() => {
                                setData('gallery_images', data.gallery_images.filter((_, i) => i !== index));
                                setImageInputs(imageInputs.filter((_, i) => i !== index));
                            }} className="text-red-500">
                                ❌
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setImageInputs([...imageInputs, ''])} className="w-full bg-gray-200 text-gray-700 p-2 rounded mt-2">
                        ➕ Add Another Image
                    </button>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={processing} className="w-full bg-blue-600 text-white p-2 rounded mt-2">
                    {processing ? 'Creating...' : 'Create Listing'}
                </button>
            </form>
        </div>
    );
}
