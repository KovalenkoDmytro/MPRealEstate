import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {Typography} from "@mui/material";
import {OfferStats} from "@/components/dashbord/seller/offers/type";
import BuyerOffersCard from "@/components/dashbord/buyer/offers/BuyerOffersCard";
import {AppointmentsStats} from "@/components/dashbord/seller/appointments/type";
import BuyerAppointmentsCard from "@/components/dashbord/buyer/appointments/BuyerAppointmentsCard";
import SavedPropertyCard from "@/components/dashbord/buyer/favorites/SavedPropertyCard";
import type {RealEstateListing} from "@/types";

type PageProps = {
    offers_stats: OfferStats;
    appointments_stats: AppointmentsStats;
    favorite_listings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number
    };
};

export default function Dashboard({ offers_stats, appointments_stats, favorite_listings }: PageProps) {


    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    Dashboard
                </Typography>
            }
        >
            <Head title="Dashboard" />

            <BuyerOffersCard data={offers_stats} />

            <BuyerAppointmentsCard data={appointments_stats}/>

            <SavedPropertyCard favoritesTotal={favorite_listings.total}/>


        </AuthenticatedLayout>
    );
}
