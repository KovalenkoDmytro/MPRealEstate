import { Link, router } from "@inertiajs/react";
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
    filters: Record<string, any>;
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

        // Extended fields
        property_type: filters.property_type || '',
        square_feet_min: filters.square_feet_min || '',
        square_feet_max: filters.square_feet_max || '',
        lot_size_min: filters.lot_size_min || '',
        lot_size_max: filters.lot_size_max || '',
        year_built_min: filters.year_built_min || '',
        year_built_max: filters.year_built_max || '',
        garage_spaces_min: filters.garage_spaces_min || '',
        has_garage: filters.has_garage === 'true' || filters.has_garage === true,
        has_basement: filters.has_basement === 'true' || filters.has_basement === true,
        hoa_fees_min: filters.hoa_fees_min || '',
        hoa_fees_max: filters.hoa_fees_max || '',
        property_taxes_min: filters.property_taxes_min || '',
        property_taxes_max: filters.property_taxes_max || '',
        price_reduced: filters.price_reduced === 'true' || filters.price_reduced === true,
        listed_since: filters.listed_since || '',
        keywords: filters.keywords || '',
    });

    const updateFilter = (key: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const isFavorited = (id: number) => favoriteListings.includes(id);

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();

        // Only keep non-empty values
        const query = Object.fromEntries(
            Object.entries(form).filter(([_, value]) => value !== '' && value !== false)
        );

        router.get(route("buyer.listings.index"), query, {
            preserveScroll: true,
            preserveState: true,
        });
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
                    <input type="text" placeholder="Location" value={form.location} onChange={(e) => updateFilter("location", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Min Price" value={form.min_price} onChange={(e) => updateFilter("min_price", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Max Price" value={form.max_price} onChange={(e) => updateFilter("max_price", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Min Bedrooms" value={form.bedrooms} onChange={(e) => updateFilter("bedrooms", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Min Bathrooms" value={form.bathrooms} onChange={(e) => updateFilter("bathrooms", e.target.value)} className="input input-bordered w-full" />

                    <select value={form.status} onChange={(e) => updateFilter("status", e.target.value)} className="input input-bordered w-full">
                        <option value="">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                    </select>

                    <select value={form.property_type} onChange={(e) => updateFilter("property_type", e.target.value)} className="input input-bordered w-full">
                        <option value="">All Property Types</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="land">Land</option>
                        <option value="multi-family">Multi-family</option>
                        <option value="farm">Farm</option>
                    </select>

                    <input type="number" placeholder="Min SqFt" value={form.square_feet_min} onChange={(e) => updateFilter("square_feet_min", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Max SqFt" value={form.square_feet_max} onChange={(e) => updateFilter("square_feet_max", e.target.value)} className="input input-bordered w-full" />

                    <input type="number" placeholder="Min Lot Size" value={form.lot_size_min} onChange={(e) => updateFilter("lot_size_min", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Max Lot Size" value={form.lot_size_max} onChange={(e) => updateFilter("lot_size_max", e.target.value)} className="input input-bordered w-full" />

                    <input type="number" placeholder="Min Year Built" value={form.year_built_min} onChange={(e) => updateFilter("year_built_min", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Max Year Built" value={form.year_built_max} onChange={(e) => updateFilter("year_built_max", e.target.value)} className="input input-bordered w-full" />

                    <input type="number" placeholder="Min Garage Spaces" value={form.garage_spaces_min} onChange={(e) => updateFilter("garage_spaces_min", e.target.value)} className="input input-bordered w-full" />

                    <input type="number" placeholder="Min HOA Fees" value={form.hoa_fees_min} onChange={(e) => updateFilter("hoa_fees_min", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Max HOA Fees" value={form.hoa_fees_max} onChange={(e) => updateFilter("hoa_fees_max", e.target.value)} className="input input-bordered w-full" />

                    <input type="number" placeholder="Min Property Taxes" value={form.property_taxes_min} onChange={(e) => updateFilter("property_taxes_min", e.target.value)} className="input input-bordered w-full" />
                    <input type="number" placeholder="Max Property Taxes" value={form.property_taxes_max} onChange={(e) => updateFilter("property_taxes_max", e.target.value)} className="input input-bordered w-full" />

                    <input type="date" value={form.listed_since} onChange={(e) => updateFilter("listed_since", e.target.value)} className="input input-bordered w-full" />
                    <input type="text" placeholder="Keywords" value={form.keywords} onChange={(e) => updateFilter("keywords", e.target.value)} className="input input-bordered w-full" />

                    <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" checked={form.favorites_only} onChange={(e) => updateFilter("favorites_only", e.target.checked)} />
                        <span>Favorites Only</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" checked={form.has_garage} onChange={(e) => updateFilter("has_garage", e.target.checked)} />
                        <span>Has Garage</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" checked={form.has_basement} onChange={(e) => updateFilter("has_basement", e.target.checked)} />
                        <span>Has Basement</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" checked={form.price_reduced} onChange={(e) => updateFilter("price_reduced", e.target.checked)} />
                        <span>Price Reduced</span>
                    </label>

                    <button type="submit" className="btn btn-primary col-span-full sm:col-span-1">
                        Apply Filters
                    </button>
                </form>

                {/* 🏠 Listings Grid */}
                {listings.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {listings.data.map((listing) => (
                            <div key={listing.id} className="border rounded-lg shadow-md overflow-hidden">
                                {listing.main_image ? (
                                    <img src={listing.main_image.image_path} alt={listing.title} className="w-full h-48 object-cover" />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                        ❌ No Image Available
                                    </div>
                                )}

                                <div className="p-4">
                                    <h2 className="text-lg font-bold">{listing.title}</h2>
                                    <p className="text-gray-600">📍 {listing.location}</p>
                                    <p className="text-lg font-semibold">💰 ${listing.price.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">👤 Seller: {listing.seller?.name || "N/A"}</p>

                                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                                        <p>🛏️ Bedrooms: {listing.bedrooms}</p>
                                        <p>🛁 Bathrooms: {listing.bathrooms}</p>
                                        <p>📐 Size: {listing.square_feet.toLocaleString()} sqft</p>
                                        {listing.lot_size && <p>🏡 Lot Size: {listing.lot_size.toLocaleString()} sqft</p>}
                                        {listing.year_built && <p>🏗️ Year Built: {listing.year_built}</p>}
                                        {listing.property_type && <p>🏠 Type: {listing.property_type}</p>}
                                        <p>🏷️ Status: {listing.status}</p>

                                        {listing.hoa_fees && <p>💸 HOA Fees: ${listing.hoa_fees.toLocaleString()}</p>}
                                        {listing.property_taxes && <p>📊 Property Taxes: ${listing.property_taxes.toLocaleString()}</p>}

                                        <p>🚗 Garage: {listing.has_garage ? "Yes" : "No"} ({listing.garage_spaces !== null ? listing.garage_spaces : "0"} space{listing.garage_spaces !== 1 ? "s" : ""})</p>
                                        <p>🏠 Basement: {listing.has_basement ? "Yes" : "No"}</p>
                                        <p>⬇️ Price Reduced: {listing.price_reduced ? "Yes" : "No"}</p>
                                    </div>

                                    <form onSubmit={(e) => toggleFavorite(e, listing.id, isFavorited(listing.id))}>
                                        <button
                                            type="submit"
                                            className={`mt-2 text-2xl ${isFavorited(listing.id) ? "text-red-500" : "text-gray-400"}`}
                                        >
                                            {isFavorited(listing.id) ? "💔" : "❤️"}
                                        </button>
                                    </form>

                                    <Link href={`/buyer/listings/${listing.id}`} className="block text-blue-500 mt-2">
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
                                className={`px-3 py-1 border rounded ${link.active ? "bg-blue-500 text-white" : "text-gray-700"} ${!link.url && "opacity-50 cursor-not-allowed"}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
