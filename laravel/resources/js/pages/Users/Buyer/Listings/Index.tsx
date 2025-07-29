import { router, Head } from "@inertiajs/react";
import React, {useCallback, useState} from "react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import type { RealEstateListing } from "@/types";
import { FilterForm } from "@/components/listings/FilterForm";
import { ListingsGrid } from "@/components/listings/ListingsGrid";
import { listingService } from "@/services/listingService";

type Props = {
    listings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    favoriteListings: number[];
    filters: Record<string, any>;
};

export default function Index({ listings, favoriteListings, filters }: Props) {
    const [form, setForm] = useState({
        location: filters.location || "",
        min_price: filters.min_price || "",
        max_price: filters.max_price || "",
        bedrooms: filters.bedrooms || "",
        bathrooms: filters.bathrooms || "",
        status: filters.status || "",
        favorites_only: filters.favorites_only === "true" || filters.favorites_only === true,

        // Extended fields
        property_type: filters.property_type || "",
        square_feet_min: filters.square_feet_min || "",
        square_feet_max: filters.square_feet_max || "",
        lot_size_min: filters.lot_size_min || "",
        lot_size_max: filters.lot_size_max || "",
        year_built_min: filters.year_built_min || "",
        year_built_max: filters.year_built_max || "",
        garage_spaces_min: filters.garage_spaces_min || "",
        has_garage: filters.has_garage === "true" || filters.has_garage === true,
        has_basement: filters.has_basement === "true" || filters.has_basement === true,
        hoa_fees_min: filters.hoa_fees_min || "",
        hoa_fees_max: filters.hoa_fees_max || "",
        property_taxes_min: filters.property_taxes_min || "",
        property_taxes_max: filters.property_taxes_max || "",
        price_reduced: filters.price_reduced === "true" || filters.price_reduced === true,
        listed_since: filters.listed_since || "",
        keywords: filters.keywords || "",
    });

    const updateFilter = (key: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const isFavorite = (id: number) => favoriteListings.includes(id);

    const applyFilters = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const query = listingService.applyFilters(form);

        router.get(route("buyer.listings.index"), query, {
            preserveScroll: true,
            preserveState: true,
        });
    }, [form]);


    const toggleFavorite = async (e: React.FormEvent, listingId: number, isFav: boolean) => {
        e.preventDefault();
        try {
            await listingService.toggleFavorite(listingId, isFav);
            router.reload({ only: ["favoriteListings"] });
            alert(isFav ? "Removed from favorites" : "Added to favorites");
        } catch (error) {
            console.error("Error toggling favorite:", error);
            alert("Something went wrong while updating favorites.");
        }
    };

    return (
        <AuthenticatedLayout
            header={<h1 className="text-xl font-semibold leading-tight text-gray-800">🏡 My Real Estate Listings</h1>}
        >
            <Head title="My Listings" />

            <FilterForm form={form} updateFilter={updateFilter} onApplyFilters={applyFilters} />

            <ListingsGrid listings={listings} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />
        </AuthenticatedLayout>
    );
}
