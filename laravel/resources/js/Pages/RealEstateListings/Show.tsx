import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";

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
        status: string;
        seller: { name: string };
    };
};

type AuthProps = {
    user: { role: string };
};

interface ShowProps {
    listing: ListingProps["listing"];
    auth: AuthProps;
}

export default function Show({ listing, auth }: ShowProps) {
    const { data, setData, post, processing, errors } = useForm({
        offer_price: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/listings/${listing.id}/make-offer`, {
            preserveScroll: true,
            onSuccess: () => alert("Offer sent successfully!"),
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-lg">Price: <strong>${listing.price}</strong></p>
            <p className="text-lg">Location: {listing.location}</p>
            <p className="text-lg">Bedrooms: {listing.bedrooms}</p>
            <p className="text-lg">Bathrooms: {listing.bathrooms}</p>
            <p className="text-lg">Listed by: {listing.seller.name}</p>

            <div className="mt-4">
                <Link href="/listings" className="text-blue-500">Back to Listings</Link>
            </div>

            {/* Offer Form (Only for Buyers) */}
            {auth.user.role === "buyer" && (
                <div className="mt-6 p-4 border border-gray-300 rounded-md">
                    <h2 className="text-xl font-bold">Make an Offer</h2>
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
                </div>
            )}



        </div>
    );
}
