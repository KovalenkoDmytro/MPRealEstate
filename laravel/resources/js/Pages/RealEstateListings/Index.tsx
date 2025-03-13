import { Link } from "@inertiajs/react";

type Listing = {
    id: number;
    title: string;
    price: number;
    location: string;
    seller: { name: string };
    main_image: { image_path: string } | null;
};

export default function Index({ listings }: { listings: Listing[] }) {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">🏡 Real Estate Listings</h1>

            {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <div key={listing.id} className="border rounded-lg shadow-md overflow-hidden">
                            {/* ✅ Show Main Image if Available */}
                            {listing.main_image ? (
                                <img
                                    src={listing.main_image.image_path}
                                    alt={listing.title}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                    ❌ No Image Available
                                </div>
                            )}

                            <div className="p-4">
                                <h2 className="text-lg font-bold">{listing.title}</h2>
                                <p className="text-gray-600">📍 {listing.location}</p>
                                <p className="text-lg font-semibold">
                                    💰 ${listing.price.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">👤 Seller: {listing.seller.name}</p>

                                <Link
                                    href={`/listings/${listing.id}`}
                                    className="block text-blue-500 mt-2"
                                >
                                    🔍 View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No listings found.</p>
            )}
        </div>
    );
}
