import React from "react";
import { Head } from "@inertiajs/react";

import type { Deal } from "@/types/pageProps"; // or wherever DealProps is defined

export default  function Show (deal : Deal) {


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <Head title={`Deal: ${deal.name}`} />

            <h1 className="text-2xl font-bold mb-4">{deal.name}</h1>
            <p className="text-gray-600">💰 Amount: ${deal.amount.toLocaleString()}</p>
            {/*<p className="text-gray-700">📌 Step: <span className="font-semibold">{deal.current_step}</span></p>*/}
            <p className="text-gray-500 italic mt-2">📝 {deal.data?.description}</p>

            {/* Real Estate Listing (if available) */}
            {deal.real_estate_listing && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-xl font-semibold">🏡 Property Details</h2>

                    {
                        deal.real_estate_listing.images.map(image => {
                            return (
                                <img
                                    src={image.image_path}
                                    alt="Property Image"
                                    className="w-full h-64 object-cover rounded-lg mt-2"
                                />
                            )
                        })
                    }

                    <p className="text-lg font-medium">{deal.real_estate_listing.title}</p>
                    <p>📍 {deal.real_estate_listing.location}</p>
                    <p>💰 Price: ${deal.real_estate_listing.price.toLocaleString()}</p>
                    <p>🛏 {deal.real_estate_listing.bedrooms} Beds | 🛁 {deal.real_estate_listing.bathrooms} Baths</p>
                </div>
            )}

            {/* Users Involved in Deal */}
            <div className="mt-6 border-t pt-4">
                <h2 className="text-xl font-semibold">👥 Users Involved</h2>
                <ul className="list-disc ml-6 mt-2">
                    {deal.users.map((user) => (
                        <li key={user.id} className="text-gray-700">
                            {user.name} ({user.role})
                            <span className="text-gray-500 text-sm"> - {user.email}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
