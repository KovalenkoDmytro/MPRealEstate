import { Link, router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import type { Listing } from "@/types/pageProps";
import {FilterForm} from "@/Components/listings/FilterForm";
import {ListingsGrid} from "@/Components/listings/ListingsGrid";


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
                <FilterForm form={form} updateFilter={updateFilter} onApplyFilters={applyFilters} />


                <ListingsGrid
                    listings={listings}
                    isFavorited={isFavorited}
                    toggleFavorite={toggleFavorite}
                />
            </div>
        </AuthenticatedLayout>
    );
}
