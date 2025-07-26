import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {ImageGallery} from "@/Components/listing/ImageGallery";
import {ListingDetails} from "@/Components/listing/ListingDetails";
import {OfferFeedback} from "@/Components/listing/OfferFeedback";
import {OfferForm} from "@/Components/listing/OfferForm";


export default function Show({ listing, userOffer }) {
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
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Listings</h2>}
    >
      <Head title="My Listings" />
      <div className="container mx-auto p-6">
        <ImageGallery mainImage={listing.main_image} images={listing.images || []} />
        <ListingDetails listing={listing} />
        {listing.status === 'pending' && <OfferFeedback userOffer={userOffer} />}
        {listing.status !== 'pending' && (
          <div className="mt-6 p-4 border border-gray-300 rounded-md">
            <OfferForm onSubmit={handleSubmit} processing={false} errors={{}} />
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
