import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {Typography} from "@mui/material";
import {OfferStats} from "@/components/dashbord/seller/offers/type";
import BuyerOffersCard from "@/components/dashbord/buyer/offers/BuyerOffersCard";
import {AppointmentsStats} from "@/components/dashbord/seller/appointments/type";
import BuyerAppointmentsCard from "@/components/dashbord/buyer/appointments/BuyerAppointmentsCard";
import SavedPropertyCard from "@/components/dashbord/buyer/favorites/SavedPropertyCard";
import SavedPropertiesPreviewSection
    from "@/components/dashbord/buyer/favorites/SavedPropertiesPreviewSection/SavedPropertiesPreviewSection";
import {FavoriteListings} from "@/types/favoriteListings";

type PageProps = {
    offers_stats: OfferStats;
    appointments_stats: AppointmentsStats;
    favorite_listings: FavoriteListings;
};

export default function Dashboard({ offers_stats, appointments_stats, favorite_listings }: PageProps) {

    console.log(favorite_listings)

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

            <SavedPropertiesPreviewSection favoriteListing={favorite_listings}/>

        </AuthenticatedLayout>
    );
}
