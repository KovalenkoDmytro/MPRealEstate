import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {Offer} from "@/types";
import OffersGrid from "@/components/offers/OffersGrid";
import {SellerStats} from "@/types/sellerAppointmentsStat";
import AppointmentStats from "@/components/dashbord/seller/appointments/AppointmentStats";
import {PerformanceStats} from "@/components/dashbord/seller/propertyPerformance/types";
import PropertyPerformance from "@/components/dashbord/seller/propertyPerformance/PropertyPerformance";
import DealPerformance from "@/components/dashbord/seller/deals/DealPerformance";
import {DealStats} from "@/components/dashbord/seller/deals/types";


interface DashboardProps {
    offers: Offer[];
    appointments_stats: SellerStats;
    listingsPerformance_stats: PerformanceStats;
    deals_stats: DealStats;
}

export default function Dashboard({ offers, appointments_stats, listingsPerformance_stats ,deals_stats}: DashboardProps) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashbord
                </h2>
            }
        >
            <Head title="Dashbord" />
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <h2 className="text-xl mt-4 font-semibold">Pending Offers</h2>

            <AppointmentStats stats={appointments_stats}/>

            <PropertyPerformance stats={listingsPerformance_stats} />

            <DealPerformance stats={deals_stats}/>

            <OffersGrid
                offers={offers}
                filterStatus="pending"
            />

            <div className="mt-6">
                <Link href={route('listings.index')} className="text-blue-500">View My Listings</Link>
            </div>
        </div>

        </AuthenticatedLayout>
    );
}
