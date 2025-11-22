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
    Button,
    Chip,
    TextField
} from "@mui/material";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { RealEstateListing, User } from "@/types";
import { appointmentService } from "@/services/appointmentService";
import { useNotification } from "@/context/NotificationContext";
import { format } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";

export interface SellerAppointment {
    id: number;
    buyer_id: number;
    seller_id: number;
    real_estate_listing_id: number;

    scheduled_at: string;
    status: "pending" | "accepted" | "rejected";

    access_code?: string | null;
    rejection_reason?: string | null;

    buyer: User;
    listing: RealEstateListing;
}

export interface SellerAppointmentsPageProps {
    appointments: SellerAppointment[];
}

export default function SellerAppointmentsPage({ appointments }: SellerAppointmentsPageProps) {
    const { showNotification } = useNotification();

    // Dialog state
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedApptId, setSelectedApptId] = useState<number | null>(null);

    // Reject reason
    const [rejectionReason, setRejectionReason] = useState("");
    const [accessCode, setAccessCode] = useState("");
    /** Open approve confirmation */
    const openApproveDialog = (id: number) => {
        setSelectedApptId(id);
        setApproveDialogOpen(true);
    };

    /** Open reject dialog */
    const openRejectDialog = (id: number) => {
        setSelectedApptId(id);
        setRejectionReason("");
        setRejectDialogOpen(true);
    };

    /** Approve action */
    const approveAppointment = async () => {
        if (!selectedApptId) return;
        const response = await appointmentService.handle({
            appointment_id: selectedApptId,
            action: "approve",
            access_code: accessCode,
        });

        showNotification(response.message, response.status);
        location.reload();
    };

    /** Reject action */
    const rejectAppointment = async () => {
        if (!selectedApptId) return;
        const response = await appointmentService.handle({
            appointment_id: selectedApptId,
            action: "reject",
            rejection_reason: rejectionReason,
        });

        showNotification(response.message, response.status);
        location.reload();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">📅 My Appointments</h2>}
        >
            <Box maxWidth="900px" mx="auto" mt={4}>
                <Typography variant="h4" gutterBottom>
                    My Appointments
                </Typography>

                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Listing</TableCell>
                                    <TableCell>Buyer</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {appointments.map((appt) => (
                                    <TableRow key={appt.id}>
                                        <TableCell>
                                            <Typography fontWeight="bold">
                                                {appt.listing.title}
                                            </Typography>
                                            <Typography variant="body2">
                                                ${appt.listing.price}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>{appt.buyer.name}</TableCell>

                                        <TableCell>
                                            {format(new Date(appt.scheduled_at), "PPpp")}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={appt.status}
                                                color={
                                                    appt.status === "pending"
                                                        ? "warning"
                                                        : appt.status === "accepted"
                                                            ? "success"
                                                            : "error"
                                                }
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            {appt.status === "pending" && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                        onClick={() => openApproveDialog(appt.id)}
                                                    >
                                                        Approve
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => openRejectDialog(appt.id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Box>

            {/* Approve Dialog */}
            <ConfirmDialog
                open={approveDialogOpen}
                title="Approve Appointment?"
                confirmLabel="Approve"
                confirmColor="success"
                onClose={() => setApproveDialogOpen(false)}
                onConfirm={approveAppointment}
                description={
                    <TextField
                        label="Access Code"
                        fullWidth
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                    />}
            />

            {/* Reject Dialog */}
            <ConfirmDialog
                open={rejectDialogOpen}
                title="Reject Appointment?"
                confirmLabel="Reject"
                confirmColor="error"
                onClose={() => setRejectDialogOpen(false)}
                onConfirm={rejectAppointment}
                description={
                    <TextField
                        label="Rejection Reason"
                        multiline
                        minRows={3}
                        fullWidth
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        required
                    />
                }
            />
        </AuthenticatedLayout>
    );
}
