import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Button,
    Link
} from "@mui/material";

import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { format } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import { appointmentService } from "@/services/appointmentService";
import { useNotification } from "@/context/NotificationContext";
import ApointmentsOverviewCards from "@/pages/Users/Buyer/Appointments/ApointmentsOverviewCards";
import type {BuyerAppointmentsPage} from "@/types/Appointments/buyerAppointmentsStat";
import AppointmentCalendar from "@/components/appointment/AppointmentCalendar";


export default function BuyerAppointmentsPage( appointments : BuyerAppointmentsPage) {
    const { showNotification } = useNotification();

    // Dialog state
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedApptId, setSelectedApptId] = useState<number | null>(null);

    const openCancelDialog = (id: number) => {
        setSelectedApptId(id);
        setCancelDialogOpen(true);
    };

    // Confirm cancellation
    const cancelAppointment = async () => {
        if (!selectedApptId) return;

        try {
            const response = await appointmentService.buyerCancel({
                appointment_id: selectedApptId,
            });

            showNotification(response.message, response.status);
            location.reload();
        } catch (err) {
            showNotification("Something went wrong.", "error");
        }
    };

    const calendarData = ()=>{
        return[
            ...appointments.upcoming_appointments,
            ...appointments.today_appointments,
            ...appointments.past_appointments,
        ]
    }
    console.log(appointments.today_appointments)

    return (
        <AuthenticatedLayout header="My Appointments">

            <ApointmentsOverviewCards
                todayCount={appointments.today_appointments.length}
                upcomingCount={appointments.upcoming_appointments.length}
                acceptedCount={appointments.accepted_appointments.length}
                rejectedCount={appointments.rejected_appointments.length}
                pendingCount={appointments.pending_appointments.length}
                cancelledCount={appointments.canceled_appointments.length}
            />

            <AppointmentCalendar appointments={calendarData()} />


            {/*<Box  mx="auto" mt={4}>*/}


            {/*    <Card>*/}
            {/*        <CardContent>*/}
            {/*            <Table>*/}
            {/*                <TableHead>*/}
            {/*                    <TableRow>*/}
            {/*                        <TableCell>Listing</TableCell>*/}
            {/*                        <TableCell>Seller</TableCell>*/}
            {/*                        <TableCell>Date</TableCell>*/}
            {/*                        <TableCell>Status</TableCell>*/}
            {/*                        <TableCell>Details</TableCell>*/}
            {/*                        <TableCell align="right">Actions</TableCell>*/}
            {/*                    </TableRow>*/}
            {/*                </TableHead>*/}

            {/*                <TableBody>*/}
            {/*                    {appointments.all_appointments.map((appt) => (*/}
            {/*                        <TableRow key={appt.id}>*/}
            {/*                            <TableCell>*/}
            {/*                                <Link href={route('buyer.listings.show', appt.listing.id)}>{appt.listing.title}</Link>*/}
            {/*                                <Typography variant="body2">${appt.listing.price}</Typography>*/}
            {/*                            </TableCell>*/}

            {/*                            <TableCell>{appt.seller.name}</TableCell>*/}

            {/*                            <TableCell>*/}
            {/*                                {format(new Date(appt.scheduled_at), "PPpp")}*/}
            {/*                            </TableCell>*/}

            {/*                            <TableCell>*/}
            {/*                                <Chip*/}
            {/*                                    label={appt.status}*/}
            {/*                                    color={*/}
            {/*                                        appt.status === "pending"*/}
            {/*                                            ? "warning"*/}
            {/*                                            : appt.status === "accepted"*/}
            {/*                                                ? "success"*/}
            {/*                                                : appt.status === "rejected"*/}
            {/*                                                    ? "error"*/}
            {/*                                                    : "default"*/}
            {/*                                    }*/}
            {/*                                />*/}
            {/*                            </TableCell>*/}

            {/*                            <TableCell>*/}
            {/*                                {appt.status === "accepted" && appt.access_code && (*/}
            {/*                                    <Typography color="green">*/}
            {/*                                        Access Code: <strong>{appt.access_code}</strong>*/}
            {/*                                    </Typography>*/}
            {/*                                )}*/}

            {/*                                {appt.status === "rejected" && appt.rejection_reason && (*/}
            {/*                                    <Typography color="error">*/}
            {/*                                        Reason: {appt.rejection_reason}*/}
            {/*                                    </Typography>*/}
            {/*                                )}*/}

            {/*                                {appt.status === "cancelled by buyer" && (*/}
            {/*                                    <Typography color="gray">*/}
            {/*                                        You cancelled this appointment.*/}
            {/*                                    </Typography>*/}
            {/*                                )}*/}
            {/*                            </TableCell>*/}

            {/*                            <TableCell align="right">*/}
            {/*                                {(appt.status === "pending" || appt.status === "accepted") && (*/}
            {/*                                    <Button*/}
            {/*                                        variant="outlined"*/}
            {/*                                        color="error"*/}
            {/*                                        size="small"*/}
            {/*                                        onClick={() => openCancelDialog(appt.id)}*/}
            {/*                                    >*/}
            {/*                                        Cancel*/}
            {/*                                    </Button>*/}
            {/*                                )}*/}
            {/*                            </TableCell>*/}
            {/*                        </TableRow>*/}
            {/*                    ))}*/}
            {/*                </TableBody>*/}
            {/*            </Table>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}
            {/*</Box>*/}

            {/* Cancel Confirmation Dialog */}
            <ConfirmDialog
                open={cancelDialogOpen}
                title="Cancel Appointment?"
                description="Are you sure you want to cancel this appointment?"
                confirmLabel="Cancel Appointment"
                confirmColor="error"
                onClose={() => setCancelDialogOpen(false)}
                onConfirm={cancelAppointment}
            />
        </AuthenticatedLayout>
    );
}
