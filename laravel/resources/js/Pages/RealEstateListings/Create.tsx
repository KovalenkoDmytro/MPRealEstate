import { useForm } from '@inertiajs/react';

export default function CreateListing() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        square_feet: 500,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/listings');
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create a New Listing</h2>

            <form onSubmit={submit}>
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

                <button type="submit" disabled={processing} className="w-full bg-blue-600 text-white p-2 rounded mt-2">
                    {processing ? 'Creating...' : 'Create Listing'}
                </button>
            </form>
        </div>
    );
}
