import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {Typography} from "@mui/material";
import {OfferStats} from "@/components/dashbord/seller/offers/type";
import BuyerOffersCard from "@/components/offers/OffersGrid/BuyerOffersCard";
import BuyerAppointmentsCard from "@/components/appointment/BuyerAppointmentsCard";
import {AppointmentsStats} from "@/components/dashbord/seller/appointments/type";

type PageProps = {
    offers_stats: OfferStats;
    appointments_stats: AppointmentsStats
};

export default function Dashboard({ offers_stats, appointments_stats }: PageProps) {
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

        </AuthenticatedLayout>
    );
}
