import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { ImageGallery } from "@/components/listing/ImageGallery";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { OfferFeedback } from "@/components/listing/OfferFeedback";
import { OfferForm } from "@/components/listing/OfferForm";
import { Offer, RealEstateListing } from "@/types";
import { offerService } from "@/services/OfferService";

export default function Show({ listing, userOffer }: { listing: RealEstateListing; userOffer: Offer }) {
    const handleSubmit = async (data: { amount: string; message: string }) => {
        try {
            const { ok, status, data: json } = await offerService.makeOffer(listing.id, data);

            if (ok) {
                if (json.status === "success") {
                    alert(json.message);
                    window.location.reload();
                } else {
                    alert(json.message || "Something went wrong.");
                }
            } else if (status === 422) {
                alert(json.message || "Validation error.");
            } else {
                alert(json.message || "Unexpected error occurred.");
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Listings</h2>}
        >
            <Head title="My Listings" />
            <div className="container mx-auto p-6">
                <ImageGallery mainImage={listing.main_image} images={listing.images || []} />
                <ListingDetails listing={listing} />
                {listing.status === "pending" && <OfferFeedback userOffer={userOffer} />}
                {listing.status !== "pending" && (
                    <div className="mt-6 p-4 border border-gray-300 rounded-md">
                        {userOffer ? (
                            <>
                                <h2 className="text-xl font-bold text-green-700">✅ Your Offer</h2>
                                <p className="mt-2 text-lg">
                                    💵 <strong>${parseFloat(String(userOffer.amount)).toLocaleString()}</strong>
                                </p>
                                <p className="mt-1 text-gray-700 whitespace-pre-line">📝 {userOffer.message}</p>
                            </>
                        ) : (
                            <OfferForm onSubmit={handleSubmit} processing={false} errors={{}} />
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
