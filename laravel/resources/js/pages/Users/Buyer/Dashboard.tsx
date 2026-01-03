import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Box, Typography, Grid } from "@mui/material";
import { OfferStats, AppointmentsStats } from "@/types/models";
import { FavoriteListings } from "@/types/favoriteListings";
import { Offer } from "@/types";
import SavedPropertiesPreviewSection from "@/components/dashboard/buyer/favorites/SavedPropertiesPreviewSection/SavedPropertiesPreviewSection";
import RecentOffersList from "@/components/dashboard/buyer/offers/RecentOffersList";
import StatCard from "@/components/common/StatCard";

type PageProps = {
    offers: Offer[];
    offers_stats: OfferStats;
    appointments_stats: AppointmentsStats;
    favorite_listings: {
        listings: FavoriteListings;
        last_week_total: number;
    };
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
                        <StatCard
                            label="My Offers"
                            value={offers_stats.accepted + offers_stats.pending}
                            detail={`${offers_stats.accepted} Accepted, ${offers_stats.pending} Pending`}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <path d="M7 2.33333L3.5 7V23.3333C3.5 23.9522 3.74583 24.5457 4.18342 24.9832C4.621 25.4208 5.21449 25.6667 5.83333 25.6667H22.1667C22.7855 25.6667 23.379 25.4208 23.8166 24.9832C24.2542 24.5457 24.5 23.9522 24.5 23.3333V7L21 2.33333H7Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.5 7H24.5" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.6666 11.6667C18.6666 12.9043 18.175 14.0913 17.2998 14.9665C16.4246 15.8417 15.2377 16.3333 14 16.3333C12.7623 16.3333 11.5753 15.8417 10.7001 14.9665C9.82498 14.0913 9.33331 12.9043 9.33331 11.6667" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>}
                            iconColor="#572A4D"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <StatCard
                            label="Saved Properties"
                            value={favorite_listings.listings.total}
                            detail={`${favorite_listings.last_week_total}  New this week`}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <path d="M22.1666 16.3333C23.905 14.63 25.6666 12.5883 25.6666 9.91667C25.6666 8.21486 24.9906 6.58276 23.7873 5.3794C22.5839 4.17604 20.9518 3.5 19.25 3.5C17.1966 3.5 15.75 4.08333 14 5.83333C12.25 4.08333 10.8033 3.5 8.74998 3.5C7.04817 3.5 5.41607 4.17604 4.21271 5.3794C3.00935 6.58276 2.33331 8.21486 2.33331 9.91667C2.33331 12.6 4.08331 14.6417 5.83331 16.3333L14 24.5L22.1666 16.3333Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>}
                            iconColor="#CB9A9F"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>



                        <StatCard
                            label="Appointments"
                            value={appointments_stats.acceptedCount}
                            detail={appointments_stats.nextAppointmentDate
                                ? `Nearest appointment: ${appointments_stats.nextAppointmentDate} • ${appointments_stats.acceptedCount} accepted, ${appointments_stats.pendingCount} pending`
                                : `No upcoming appointments • ${appointments_stats.acceptedCount} accepted, ${appointments_stats.pendingCount} pending`}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <path d="M9.33337 2.33333V6.99999" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.6666 2.33333V6.99999" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M22.1667 4.66667H5.83333C4.54467 4.66667 3.5 5.71134 3.5 7.00001V23.3333C3.5 24.622 4.54467 25.6667 5.83333 25.6667H22.1667C23.4553 25.6667 24.5 24.622 24.5 23.3333V7.00001C24.5 5.71134 23.4553 4.66667 22.1667 4.66667Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.5 11.6667H24.5" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.33337 16.3333H9.34504" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 16.3333H14.0117" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.6666 16.3333H18.6783" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.33337 21H9.34504" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 21H14.0117" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.6666 21H18.6783" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>}
                            iconColor="#D07669"
                        />

                    </Grid>
                </Grid>


                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid size={{ xs: 12, md: 8 }} sx={{ p: 3, borderRadius: 4, bgcolor: '#fff', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', }}>
                        <RecentOffersList offers={offers} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box height="100%">
                            <SavedPropertiesPreviewSection
                                favoriteListing={favorite_listings.listings}
                                itemsToDisplay={2}
                            />
                        </Box>
                    </Grid>
                </Grid>

            </Box>
        </AuthenticatedLayout>
    );
}
