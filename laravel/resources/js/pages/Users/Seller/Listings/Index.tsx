import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import type { RealEstateListing } from "@/types";
import SellerListingsGrid from "@/components/listings/ListingsGrid";
import React from "react";
import Button from "@/components/common/Button";

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
            header="My Listings"
        >
            <Head title="My Listings"/>

            <div className="container mx-auto p-4">
                <div className="flex justify-end items-center mb-4">
                    <Button version={"primary"} link={true} text={"Add New Listing"} href={route('seller.listings.create')}/>
                </div>
                <SellerListingsGrid listings={listings}/>

            </div>
        </AuthenticatedLayout>
    );

}
