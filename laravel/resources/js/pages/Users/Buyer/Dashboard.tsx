import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import {Box, Grid} from "@mui/material";
import { OfferStats, AppointmentsStats } from "@/types/models";
import { FavoriteListings } from "@/types/favoriteListings";
import {Offer, type RealEstateListing} from "@/types";
import SavedPropertiesPreviewSection from "@/components/dashboard/buyer/favorites/SavedPropertiesPreviewSection/SavedPropertiesPreviewSection";
import RecentOffersList from "@/components/dashboard/buyer/offers/RecentOffersList";
import StatCard from "@/components/common/StatCard";
import {
    RecentlyViewedPreviewSection
} from "@/components/dashboard/buyer/recentlyViewed/RecentlyViewedPreviewSection";
import { primary, accent, info } from "@/design/tokens";
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
            <Box sx={{ p: { xs: 0, md: 3 } }}>

                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            variant="dashboard"
                            label="My Offers"
                            value={offers_stats.accepted + offers_stats.pending}
                            detail={`${offers_stats.accepted} Accepted, ${offers_stats.pending} Pending`}
                            icon={<IconMyDeals/>}
                            iconBgColor={primary[50]}
                            iconColor={primary[700]}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            variant="dashboard"
                            label="Saved Properties"
                            value={favorite_listings.listings.total}
                            detail={`${favorite_listings.last_week_total} new this week`}
                            icon={<IconFavorite />}
                            iconBgColor={accent[50]}
                            iconColor={accent[700]}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            variant="dashboard"
                            label="Appointments"
                            value={appointments_stats.acceptedCount}
                            detail={appointments_stats.nextAppointmentDate
                                ? `Nearest appointment: ${appointments_stats.nextAppointmentDate} • ${appointments_stats.acceptedCount} accepted, ${appointments_stats.pendingCount} pending`
                                : `No upcoming appointments • ${appointments_stats.acceptedCount} accepted, ${appointments_stats.pendingCount} pending`}
                            icon={<IconCalendarToday/>}
                            iconBgColor={info[50]}
                            iconColor={info[700]}
                        />
                    </Grid>
                </Grid>


                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid size={{ xs: 12 }}>
                        <RecentOffersList offers={offers.data} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, columnGap: 3, rowGap: { xs: 4, lg: 2.5 }, mt: 1 }}>

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
                        </Box>
                    </Grid>


                </Grid>

            </Box>
        </AuthenticatedLayout>
    );
}
