import { useState } from "react";
import { Link } from "@inertiajs/react";

type Offer = {
    id: number;
    buyer: { name: string, email: string };
    offer_price: number;
    message: string;
    status: string;
};

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
        offers: Offer[]; // List of offers received
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
    const [offers, setOffers] = useState<Offer[]>(listing.offers || []);

    const updateOfferStatus = async (offerId: number, status: "accepted" | "rejected") => {
        try {
            const response = await fetch(`/offers/${offerId}/update-status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const result = await response.json();

            if (result.success) {
                setOffers((prevOffers) =>
                    prevOffers.map((offer) =>
                        offer.id === offerId ? { ...offer, status } : offer
                    )
                );
                alert(`Offer ${status} successfully!`);
            } else {
                alert("Error updating offer status.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-lg">Price: <strong>${listing.price}</strong></p>
            <p className="text-lg">Location: {listing.location}</p>
            <p className="text-lg">Bedrooms: {listing.bedrooms}</p>
            <p className="text-lg">Bathrooms: {listing.bathrooms}</p>

            <div className="mt-4">
                <Link href="/listings" className="text-blue-500">Back to Listings</Link>
            </div>

            {/* Offers Section - Only for Sellers */}
            {auth.user.role === "seller" && (
                <div className="mt-6 p-4 border border-gray-300 rounded-md">
                    <h2 className="text-xl font-bold">Offers Received</h2>
                    {listing.offers && listing.offers.length > 0 ? (
                        listing.offers.map((offer) => (
                            <div key={offer.id} className="border p-4 mt-2">
                                <p><strong>Buyer Name:</strong> {offer.buyer?.name || "Unknown Buyer"}</p>
                                <p><strong>Buyer Email:</strong> {offer.buyer?.email || "No Email"}</p>
                                <p><strong>Offer Price:</strong> ${offer.offer_price}</p>
                                <p><strong>Message:</strong> {offer.message}</p>
                                <p><strong>Status:</strong> {offer.status}</p>

                                {offer.status === "pending" && (
                                    <div className="mt-2">
                                        <button
                                            onClick={() => updateOfferStatus(offer.id, "accepted")}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md mr-2"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => updateOfferStatus(offer.id, "rejected")}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No offers yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}
