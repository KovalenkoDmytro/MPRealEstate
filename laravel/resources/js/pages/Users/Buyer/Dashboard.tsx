import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Box, Typography, Grid } from "@mui/material";

import { OfferStats, AppointmentsStats } from "@/types/models";
import { FavoriteListings } from "@/types/favoriteListings";
import { Offer } from "@/types";


import BuyerOffersCard from "@/components/dashboard/buyer/offers/BuyerOffersCard";
import BuyerAppointmentsCard from "@/components/dashboard/buyer/appointments/BuyerAppointmentsCard";
import SavedPropertyCard from "@/components/dashboard/buyer/favorites/SavedPropertyCard";
import SavedPropertiesPreviewSection
    from "@/components/dashboard/buyer/favorites/SavedPropertiesPreviewSection/SavedPropertiesPreviewSection";
import RecentOffersList from "@/components/dashboard/buyer/offers/RecentOffersList";

type PageProps = {
    offers: Offer[];
    offers_stats: OfferStats;
    appointments_stats: AppointmentsStats;
    favorite_listings: FavoriteListings;
};

export default function Dashboard({ offers_stats, appointments_stats, favorite_listings, offers }: PageProps) {

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    Dashboard
                </Typography>
            }
        >
            <Head title="Dashboard" />

            <Box sx={{ p: { xs: 2, md: 3 } }}>

                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <BuyerOffersCard data={offers_stats} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <SavedPropertyCard favoritesTotal={favorite_listings.total} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <BuyerAppointmentsCard data={appointments_stats} />
                    </Grid>
                </Grid>


                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <RecentOffersList offers={offers} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box height="100%">
                            <SavedPropertiesPreviewSection favoriteListing={favorite_listings} />
                        </Box>
                    </Grid>
                </Grid>

            </Box>
        </AuthenticatedLayout>
    );
}
