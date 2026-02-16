import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import type { RealEstateListing } from "@/types";
import React from "react";
import Button from "@/components/common/Button";
import SellerListingCard from "@/components/listings/seller/SellerListingCard";
import {Stack} from "@mui/material";

type ComponentProps = {
    listings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function Index({ listings }: ComponentProps) {

    console.log(listings)
    return (
        <AuthenticatedLayout
            header="My Listings"
        >
            <Head title="My Listings"/>

            <div className="container mx-auto p-4">
                <div className="flex justify-end items-center mb-4">
                    <Button version={"primary"} link={true} text={"Add New Listing"} href={route('seller.listings.create')}/>
                </div>

                <Stack spacing={4}>
                    {listings.data.map((listing, index) => (
                        <SellerListingCard listing={listing} key={index}/>
                    ))}
                </Stack>


            </div>
        </AuthenticatedLayout>
    );

}
