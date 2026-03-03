import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import { SellerStats } from "@/types/Appointments/sellerAppointmentsStat";
import AppointmentStats from "@/components/dashboard/seller/appointments/AppointmentStats";
import { PerformanceStats } from "@/types/models";
import PropertyPerformance from "@/components/dashboard/seller/propertyPerformance/PropertyPerformance";
import DealPerformance from "@/components/dashboard/seller/deals/DealPerformance";
import { DealStats, OfferStats } from "@/types/models";
import OfferPerformance from "@/components/dashboard/seller/offers/OfferPerformance";
import {Grid, Stack} from "@mui/material";

interface DashboardProps {
    offers_stats: OfferStats;
    appointments_stats: SellerStats;
    listingsPerformance_stats: PerformanceStats;
    deals_stats: DealStats;
}

export default function Dashboard({
    offers_stats,
    appointments_stats,
    listingsPerformance_stats,
    deals_stats
}: DashboardProps) {

    return (
        <AuthenticatedLayout header="Dashboard">
            <Stack spacing={4}>
                <AppointmentStats stats={appointments_stats} />
                <PropertyPerformance stats={listingsPerformance_stats} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DealPerformance stats={deals_stats} view={'column'}/>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <OfferPerformance stats={offers_stats} view={'column'}/>
                    </Grid>
                </Grid>
            </Stack>
        </AuthenticatedLayout>
    );
}
