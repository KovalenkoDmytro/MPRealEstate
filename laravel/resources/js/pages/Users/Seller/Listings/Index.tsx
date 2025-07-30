import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import type { RealEstateListing } from "@/types";
import SellerListingsGrid from "@/components/listings/ListingsGrid";
import React from "react";

type ComponentProps = {
    listings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
};

export default function Index({ listings }: ComponentProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Listings
                </h2>
            }
        >
            <Head title="My Listings"/>

            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">🏡 My Real Estate Listings</h1>
                    <Link
                        href={route('seller.listings.create')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                    >
                        ➕ Add New Listing
                    </Link>
                </div>
                <SellerListingsGrid listings={listings}/>

            </div>
        </AuthenticatedLayout>
    );

}
