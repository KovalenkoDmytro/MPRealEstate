import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { SellerStats } from "@/types/sellerAppointmentsStat";
import AppointmentStats from "@/components/dashboard/seller/appointments/AppointmentStats";
import { PerformanceStats } from "@/types/models";
import PropertyPerformance from "@/components/dashboard/seller/propertyPerformance/PropertyPerformance";
import DealPerformance from "@/components/dashboard/seller/deals/DealPerformance";
import { DealStats, OfferStats } from "@/types/models";
import OfferPerformance from "@/components/dashboard/seller/offers/OfferPerformance";


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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <AppointmentStats stats={appointments_stats} />

            <PropertyPerformance stats={listingsPerformance_stats} />

            <DealPerformance stats={deals_stats} />

            <OfferPerformance stats={offers_stats} />



        </AuthenticatedLayout>
    );
}
