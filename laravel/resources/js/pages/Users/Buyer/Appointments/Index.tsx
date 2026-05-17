import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import AppointmentsOverviewCards from "@/components/appointment/ApointmentsOverviewCards";
import AppointmentCalendar from "@/components/appointment/AppointmentCalendar";
import AppointmentsList from "@/components/appointment/detailsList/AppointmentsList";
import type { BuyerAppointmentsPage } from "@/types/Appointments/buyerAppointmentsStat";
import {Grid} from "@mui/material";

export default function BuyerAppointmentsIndex(appointments: BuyerAppointmentsPage) {

    const calendarData = () => {
        return [
            ...appointments.accepted_appointments
        ]
    }

    return (
        <AuthenticatedLayout header="My Appointments">

            <AppointmentsOverviewCards
                todayCount={appointments.today_appointments.length}
                upcomingCount={appointments.upcoming_appointments.length}
                acceptedCount={appointments.accepted_appointments.length}
                rejectedCount={appointments.rejected_appointments.length}
                pendingCount={appointments.pending_appointments.length}
                cancelledCount={appointments.canceled_appointments.length}
            />

            <Grid container spacing={3} mt={6}>

                <Grid size={{ xs: 12, md: 5 }}>
                    <AppointmentCalendar appointments={calendarData()} />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <AppointmentsList appointments={appointments.all_appointments as any}/>
                </Grid>

            </Grid>

        </AuthenticatedLayout>
    );
}
