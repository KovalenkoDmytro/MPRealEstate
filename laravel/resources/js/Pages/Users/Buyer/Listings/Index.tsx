import { Link, router, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { Listing } from "@/types";

type Props = {
    listings: {
        data: Listing[];
        links: any[];
    };
    favoriteListings: number[];
    filters: {
        location?: string;
        min_price?: string;
        max_price?: string;
        bedrooms?: string;
        bathrooms?: string;
        status?: string;
        favorites_only?: boolean | string;
    };
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

export default function Index({ listings, favoriteListings, filters }: Props) {
    const [form, setForm] = useState({
        location: filters.location || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        bedrooms: filters.bedrooms || '',
        bathrooms: filters.bathrooms || '',
        status: filters.status || '',
        favorites_only: filters.favorites_only === 'true' || filters.favorites_only === true,
    });

    const updateFilter = (key: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const isFavorited = (id: number) => favoriteListings.includes(id);

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("buyer.listings.index"), form, { preserveScroll: true });
    };

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

                {/* 🔍 Filter Form */}
                <form
                    onSubmit={applyFilters}
                    className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <input
                        type="text"
                        placeholder="Location"
                        value={form.location}
                        onChange={(e) => updateFilter("location", e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={form.min_price}
                        onChange={(e) => updateFilter("min_price", e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={form.max_price}
                        onChange={(e) => updateFilter("max_price", e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <input
                        type="number"
                        placeholder="Min Bedrooms"
                        value={form.bedrooms}
                        onChange={(e) => updateFilter("bedrooms", e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <input
                        type="number"
                        placeholder="Min Bathrooms"
                        value={form.bathrooms}
                        onChange={(e) => updateFilter("bathrooms", e.target.value)}
                        className="input input-bordered w-full"
                    />
                    <select
                        value={form.status}
                        onChange={(e) => updateFilter("status", e.target.value)}
                        className="input input-bordered w-full"
                    >
                        <option value="">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                    </select>
                    <label className="inline-flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={form.favorites_only}
                            onChange={(e) => updateFilter("favorites_only", e.target.checked)}
                        />
                        <span>Favorites Only</span>
                    </label>

                    <button
                        type="submit"
                        className="btn btn-primary col-span-full sm:col-span-1"
                    >
                        Apply Filters
                    </button>
                </form>

                {/* 🏠 Listings Grid */}
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
