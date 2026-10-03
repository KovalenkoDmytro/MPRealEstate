import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import type {SellerAppointmentsPage} from "@/types/Appointments/sellerAppointmentsStat";
import AppointmentsOverviewCards from "@/components/appointment/ApointmentsOverviewCards";
import AppointmentCalendar from "@/components/appointment/AppointmentCalendar";
import AppointmentsList from "@/components/appointment/detailsList/AppointmentsList";
import { Box } from "@mui/material";


export default function SellerAppointmentsPage(appointments: SellerAppointmentsPage) {

    const calendarData = ()=>{
        return[
            ...appointments.accepted_appointments,
        ]
    }


    return (
        <AuthenticatedLayout header="My Appointments">

            <AppointmentsOverviewCards
                todayCount={appointments.today_appointments.length}
                upcomingCount={appointments.upcoming_appointments.length}
                acceptedCount={appointments.accepted_appointments.length}
                pendingCount={appointments.pending_appointments.length}
                cancelledCount={appointments.canceled_appointments.length}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(300px, 360px) minmax(0, 1fr)' }, gap: 3, mt: 4, alignItems: 'start' }}>
                <AppointmentCalendar appointments={calendarData()} />
                <AppointmentsList appointments={appointments.all_appointments} />
            </Box>

        </AuthenticatedLayout>
    );
}
