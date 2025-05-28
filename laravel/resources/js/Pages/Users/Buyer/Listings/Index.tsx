import { Link, router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { Listing } from "@/types";

type Props = {
    listings: {
        data: Listing[];
        links: any[];
    };
    favoriteListings: number[];
};

function getOptions(method: 'POST' | 'DELETE', body = {}) {
    return {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN':
                (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                    ?.content || '',
        },
        body: JSON.stringify(body),
    };
}

export default function Index({ listings, favoriteListings }: Props) {
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

        const options = isFav
            ? getOptions("DELETE")
            : getOptions("POST", { listing_id: listingId });

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error("Favorite toggle failed");

            router.reload({ only: ["favoriteListings"] });
            alert(isFav ? "Removed from favorites" : "Added to favorites");
        } catch (error) {
            console.error("Error toggling favorite:", error);
            alert("Something went wrong while updating favorites.");
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
            <Head title="My Listings" />

            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">🏡 My Real Estate Listings</h1>
                </div>

                {listings.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {listings.data.map((listing) => (
                            <div
                                key={listing.id}
                                className="border rounded-lg shadow-md overflow-hidden"
                            >
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
                                        👤 Seller: {listing.seller?.name || "N/A"}
                                    </p>

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

                {listings.links.length > 0 && (
                    <div className="mt-6 flex justify-center space-x-2">
                        {listings.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || ""}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 border rounded ${
                                    link.active ? "bg-blue-500 text-white" : "text-gray-700"
                                } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
