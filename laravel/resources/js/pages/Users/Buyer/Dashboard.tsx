import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import {Box, Grid, Stack} from "@mui/material";
import { OfferStats, AppointmentsStats } from "@/types/models";
import { FavoriteListings } from "@/types/favoriteListings";
import {Offer, type RealEstateListing} from "@/types";
import SavedPropertiesPreviewSection from "@/components/dashboard/buyer/favorites/SavedPropertiesPreviewSection/SavedPropertiesPreviewSection";
import RecentOffersList from "@/components/dashboard/buyer/offers/RecentOffersList";
import StatCard from "@/components/common/StatCard";
import {
    RecentlyViewedPreviewSection
} from "@/components/dashboard/buyer/recentlyViewed/RecentlyViewedPreviewSection";
import theme from "@/theme";
import IconFavorite from "@/icons/IconFavorite";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconMyDeals from "@/icons/IconMyDeals";

type PageProps = {
    offers: {
        data: Offer[];
    };
    offers_stats: OfferStats;
    appointments_stats: AppointmentsStats;
    favorite_listings: {
        listings: FavoriteListings;
        last_week_total: number;
    };
    listings_recently_viewed : RealEstateListing[];
};
export default function Dashboard({ offers_stats, appointments_stats, favorite_listings, offers, listings_recently_viewed }: PageProps) {
    return (
        <AuthenticatedLayout
            header="Dashboard"
            subHeader="Welcome back, manage your properties"
        >
            <Box sx={{ p: { xs: 2, md: 3 } }}>

                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            label="My Offers"
                            value={offers_stats.accepted + offers_stats.pending}
                            detail={`${offers_stats.accepted} Accepted, ${offers_stats.pending} Pending`}
                            icon={<IconMyDeals/>}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            label="Saved Properties"
                            value={favorite_listings.listings.total}
                            detail={`${favorite_listings.last_week_total}  New this week`}
                            icon={<IconFavorite />}
                            iconBgColor="#CB9A9F"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            label="Appointments"
                            value={appointments_stats.acceptedCount}
                            detail={appointments_stats.nextAppointmentDate
                                ? `Nearest appointment: ${appointments_stats.nextAppointmentDate} • ${appointments_stats.acceptedCount} accepted, ${appointments_stats.pendingCount} pending`
                                : `No upcoming appointments • ${appointments_stats.acceptedCount} accepted, ${appointments_stats.pendingCount} pending`}
                            icon={<IconCalendarToday/>}
                            iconBgColor="#D07669"
                        />
                    </Grid>
                </Grid>


                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid
                        size={{ xs: 12, md: 8 }}
                        sx={{
                            p: theme.shape.padding,
                            borderRadius: theme.shape.borderRadius,
                            bgcolor: theme.palette.background.white,
                            boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)'
                    }}
                    >
                        <RecentOffersList offers={offers.data} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>

                            {favorite_listings.listings.total > 0 && (
                                <SavedPropertiesPreviewSection
                                    favoriteListing={favorite_listings.listings}
                                    itemsToDisplay={2}
                                />
                            )}

                            {listings_recently_viewed.length > 0 && (
                                <RecentlyViewedPreviewSection
                                    recentlyViewedListings={listings_recently_viewed}
                                    itemsToDisplay={2}
                                />
                            )}
                        </Stack>
                    </Grid>


                </Grid>

            </Box>
        </AuthenticatedLayout>
    );
}
