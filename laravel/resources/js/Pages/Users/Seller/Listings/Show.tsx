import { useState } from "react";
import {Head, Link} from "@inertiajs/react";
import {Listing, Offer} from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ listing }: {listing : Listing}) {
    const [offers, setOffers] = useState<Offer[]>(listing.offers || []);

    const updateOfferStatus = async (offerId: number, status: "accepted" | "rejected") => {
        try {
            const response = await fetch(`/seller/offers/${offerId}/update-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "",
                    Accept: "application/json",
                },
                body: JSON.stringify({ status }),
            });

            const result = await response.json();

            if (response.ok && result.status === "success") {
                const updatedStatus = result.data?.offerStatus || status;

                setOffers(prev =>
                    prev.map(offer =>
                        offer.id === offerId ? { ...offer, status: updatedStatus } : offer
                    )
                );

                alert(result.message || `Offer ${updatedStatus} successfully!`);
            } else {
                alert(result.message || "Failed to update offer status.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Network error. Please try again.");
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Listing
                </h2>
            }
        >
            <Head title="Listings" />

        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{listing.title}</h1>

            {/* ✅ Display Main Image */}
            {listing.main_image && (
                <img
                    src={`${listing.main_image.image_path}`}
                    alt="Main Property Image"
                    className="w-full h-64 object-cover rounded-lg my-4"
                />
            )}

            {/* ✅ Display Gallery Images */}
            {listing.images && listing.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 my-4">
                    {listing.images.map((image, index) => (
                        <img
                            key={index}
                            src={image.image_path}
                            alt="Gallery Image"
                            className="w-full h-32 object-cover rounded-lg"
                        />
                    ))}
                </div>
            )}

            <p className="text-lg">📍 Location: {listing.location}</p>
            <p className="text-lg">💰 Price: <strong>${listing.price.toLocaleString()}</strong></p>
            <p className="text-lg">🛏 {listing.bedrooms} Bedrooms | 🛁 {listing.bathrooms} Bathrooms</p>
            <p className="text-lg">📏 {listing.square_feet} sqft</p>

            <div className="mt-4">
                <Link href={route('seller.listings.index')} className="text-blue-500">🔙 Back to Listings</Link>
                {listing.offers && listing.offers.length === 0 && (
                    <Link
                        href={route('seller.listings.edit', listing.id)}
                        className="text-blue-500 ml-4 inline-block"
                    >
                        ✏️ Edit Listing
                    </Link>
                )}

            </div>


            <div className="mt-6 p-4 border border-gray-300 rounded-md">
                    <h2 className="text-xl font-bold">📑 Offers Received</h2>
                    {offers.length > 0 ? (
                        offers.map((offer) => (
                            <div key={offer.id} className="border p-4 mt-2 rounded-lg">
                                <p><strong>👤 Buyer:</strong> {offer.buyer?.name || "Unknown Buyer"}</p>
                                <p><strong>📧 Email:</strong> {offer.buyer?.email || "No Email"}</p>
                                <p><strong>💰 Offer Price:</strong> ${offer.offer_price.toLocaleString()}</p>
                                <p><strong>📝 Message:</strong> {offer.message}</p>
                                <p><strong>📌 Status:</strong> {offer.status}</p>

                                {offer.status === "pending" && (
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            onClick={() => updateOfferStatus(offer.id, "accepted")}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md mr-2"
                                        >
                                            ✅ Accept
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateOfferStatus(offer.id, "rejected")}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md"
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No offers yet.</p>
                    )}
                </div>

        </div>

        </AuthenticatedLayout>
    );
}
