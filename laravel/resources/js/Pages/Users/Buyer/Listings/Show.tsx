import {Head, Link, useForm} from "@inertiajs/react";
import type {Listing, Offer} from "@/types"; // adjust if your User type is elsewhere
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";


export default function Show({listing, userOffer,}: { listing: Listing; userOffer: Offer | null; }) {
    const {data, setData, post, processing, errors} = useForm({
        offer_price: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("offer_price", data.offer_price);
        formData.append("message", data.message);

        try {
            const response = await fetch(route("buyer.listings.makeOffer", listing.id), {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                    Accept: "application/json",
                },
                body: formData,
            });

            const json = await response.json();

            if (response.ok) {
                if (json.status === "success") {
                    alert(json.message); // ✅ use message from JSON
                    window.location.reload();
                } else {
                    alert(json.message || "Something went wrong.");
                }
            } else if (response.status === 422) {
                alert(json.message || "An unexpected error occurred.");
            } else {
                alert(json.message || "An unexpected error occurred.");
                console.error("Unexpected error:", json);
            }
        } catch (error) {
            console.error("Fetch failed:", error);
            alert("Network error. Please try again later.");
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Listings
                </h2>
            }
        >
            <Head title="My Listings"/>
            <div className="container mx-auto p-6">
                {/* ✅ Image Gallery */}
                <div className="w-full max-w-3xl mx-auto">
                    {listing.main_image ? (
                        <img
                            src={listing.main_image.image_path}
                            alt="Main Image"
                            className="w-full h-72 object-cover rounded-lg shadow-md"
                        />
                    ) : (
                        <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                            ❌ No Image Available
                        </div>
                    )}
                </div>

                {/* ✅ Additional Images */}
                {listing.images && listing.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {listing.images.map((img) => (
                            <img
                                key={img.id}
                                src={img.image_path}
                                alt="Gallery"
                                className="h-24 w-full object-cover rounded-md"
                            />
                        ))}
                    </div>
                )}

                {/* ✅ Listing Details */}
                <div className="mt-6">
                    <h1 className="text-2xl font-bold">{listing.title}</h1>
                    <p className="text-lg">💰 Price: <strong>${listing.price.toLocaleString()}</strong></p>
                    <p className="text-lg">📍 Location: {listing.location}</p>
                    <p className="text-lg">🛏 Bedrooms: {listing.bedrooms}</p>
                    <p className="text-lg">🛁 Bathrooms: {listing.bathrooms}</p>
                    <p className="text-lg">📏 Size: {listing.square_feet} sqft</p>
                    <p className="text-lg">👤 Seller: {listing.seller.name}</p>

                    <div className="mt-4">
                        <Link href={route('buyer.listings.index')} className="text-blue-500">🔙 Back to Listings</Link>
                    </div>
                </div>

                {listing.status === 'pending' && (
                    <div className="mt-4">
                        {userOffer ? (
                            <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                                {userOffer.status === "accepted" && (
                                    <p className="text-green-600 font-semibold">✅ Your offer has been accepted.</p>
                                )}
                                {userOffer.status === "rejected" && (
                                    <p className="text-red-500 font-semibold">❌ Your offer has been rejected.</p>
                                )}
                                {userOffer.status === "pending" && (
                                    <p className="text-yellow-600 font-semibold">⌛ Your offer is still pending.</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-600">⌛ This listing is pending and you're not participating.</p>
                        )}
                    </div>
                )}


                {/* ✅ Offer Form (Only for Buyers) */}
                {listing.status !== 'pending' && (
                    <div className="mt-6 p-4 border border-gray-300 rounded-md">
                        {userOffer ? (
                            <>
                                <h2 className="text-xl font-bold text-green-700">✅ Your Offer</h2>
                                <p className="mt-2 text-lg">💵 <strong>${parseFloat(userOffer.offer_price).toLocaleString()}</strong></p>
                                <p className="mt-1 text-gray-700 whitespace-pre-line">📝 {userOffer.message}</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold">💰 Make an Offer</h2>
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <label className="block mb-2">
                                        Offer Price ($)
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.offer_price}
                                            onChange={(e) => setData("offer_price", e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        />
                                    </label>
                                    {errors.offer_price && <p className="text-red-500">{errors.offer_price}</p>}

                                    <label className="block mt-2">
                                        Message to Seller
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => setData("message", e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        />
                                    </label>
                                    {errors.message && <p className="text-red-500">{errors.message}</p>}

                                    <button
                                        type="submit"
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                                        disabled={processing}
                                    >
                                        {processing ? "Sending..." : "Submit Offer"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
