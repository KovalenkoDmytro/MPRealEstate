import { Link, useForm } from "@inertiajs/react";
import type { Listing } from "@/types";

export default function Index({
                                  listings,
                                  favoriteListings,
                              }: {
    listings: Listing[];
    favoriteListings: number[];
}) {
    const { post, delete: destroy } = useForm();

    const isFavorited = (id: number) => favoriteListings.includes(id);

    const toggleFavorite = async (
        e: React.FormEvent,
        listingId: number,
        isFav: boolean
    ) => {
        e.preventDefault();

        const url = isFav
            ? route("favorites.destroy", listingId)
            : route("favorites.store");

        const options: RequestInit = isFav
            ? {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": (document.querySelector(
                        'meta[name="csrf-token"]'
                    ) as HTMLMetaElement)?.content || "",
                },
                body: JSON.stringify({}),
            }
            : {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": (document.querySelector(
                        'meta[name="csrf-token"]'
                    ) as HTMLMetaElement)?.content || "",
                },
                body: JSON.stringify({
                    listing_id: listingId,
                }),
            };

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error("Favorite toggle failed");
            // Optionally reload or update local state here
            window.location.reload(); // or manually update your favoriteListings list
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">🏡 Real Estate Listings</h1>

            {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="border rounded-lg shadow-md overflow-hidden"
                        >
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
                                <p className="text-sm text-gray-500">
                                    👤 Seller: {listing.seller.name}
                                </p>

                                {/* 💖 Favorite Toggle Button */}
                                <form
                                    onSubmit={(e) =>
                                        toggleFavorite(e, listing.id, isFavorited(listing.id))
                                    }
                                >
                                    <button
                                        type="submit"
                                        className={`mt-2 text-2xl ${
                                            isFavorited(listing.id)
                                                ? "text-red-500"
                                                : "text-gray-400"
                                        }`}
                                        title={
                                            isFavorited(listing.id)
                                                ? "Remove from Favorites"
                                                : "Add to Favorites"
                                        }
                                    >
                                        {isFavorited(listing.id) ? "💔" : "❤️"}
                                    </button>
                                </form>

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
