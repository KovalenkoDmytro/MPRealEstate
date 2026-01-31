import React, { useState } from "react";
import {
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Chip,
    TextField,
    alpha
} from "@mui/material";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { RealEstateListing, User } from "@/types";
import { appointmentService } from "@/services/appointmentService";
import { useNotification } from "@/context/NotificationContext";
import { format } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import {Head} from "@inertiajs/react";
import type {SellerAppointmentsPage} from "@/types/Appointments/sellerAppointmentsStat";
import ApointmentsOverviewCards from "@/pages/Users/Buyer/Appointments/ApointmentsOverviewCards";

// Interface definitions remain the same
export interface SellerAppointment {
    id: number;
    buyer_id: number;
    seller_id: number;
    real_estate_listing_id: number;
    scheduled_at: string;
    status: "pending" | "accepted" | "rejected" | "cancelled by buyer";
    access_code?: string | null;
    rejection_reason?: string | null;
    buyer: User;
    listing: RealEstateListing;
}



export default function SellerAppointmentsPage(appointments: SellerAppointmentsPage) {


    const { showNotification } = useNotification();
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedApptId, setSelectedApptId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [accessCode, setAccessCode] = useState("");

    const openApproveDialog = (id: number) => {
        setSelectedApptId(id);
        setApproveDialogOpen(true);
    };

    const openRejectDialog = (id: number) => {
        setSelectedApptId(id);
        setRejectionReason("");
        setRejectDialogOpen(true);
    };

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

    const getStatusColor = (status: SellerAppointment['status']) => {
        switch (status) {
            case 'pending': return { color: '#F97316', bg: '#FFF7ED' }; // Orange
            case 'accepted': return { color: '#10B981', bg: '#ECFDF5' }; // Green
            case 'rejected':
            case 'cancelled by buyer': return { color: '#EF4444', bg: '#FEF2F2' }; // Red
            default: return { color: '#6B7280', bg: '#F3F4F6' }; // Gray
        }
    };

    return (
        <AuthenticatedLayout header="My Appointments">

            <ApointmentsOverviewCards
                todayCount={appointments.today_appointments.length}
                upcomingCount={appointments.upcoming_appointments.length}
                acceptedCount={appointments.accepted_appointments.length}
                pendingCount={appointments.pending_appointments.length}
                cancelledCount={appointments.canceled_appointments.length}
            />

            {/*<Box>*/}
            {/*    <Card*/}
            {/*        elevation={0}*/}
            {/*        sx={{*/}
            {/*            borderRadius: 4,*/}
            {/*            border: '1px solid',*/}
            {/*            borderColor: 'divider',*/}
            {/*            bgcolor: '#fff',*/}
            {/*            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        /!* 2. Remove CardContent to get edge-to-edge table *!/*/}
            {/*        <Table>*/}
            {/*            /!* 3. Style TableHead with light gray background and uppercase text *!/*/}
            {/*            <TableHead sx={{ bgcolor: '#F9FAFB' }}>*/}
            {/*                <TableRow>*/}
            {/*                    <TableCell sx={{ py: 2, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Listing</TableCell>*/}
            {/*                    <TableCell sx={{ py: 2, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Buyer</TableCell>*/}
            {/*                    <TableCell sx={{ py: 2, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Date</TableCell>*/}
            {/*                    <TableCell sx={{ py: 2, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>*/}
            {/*                    <TableCell sx={{ py: 2, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }} align="right">Actions</TableCell>*/}
            {/*                </TableRow>*/}
            {/*            </TableHead>*/}

            {/*            <TableBody>*/}
            {/*                {appointments.all_appointments.map((appt) => {*/}
            {/*                    const statusStyle = getStatusColor(appt.status);*/}
            {/*                    return (*/}
            {/*                        // 4. Add more padding to rows for a cleaner look*/}
            {/*                        <TableRow key={appt.id} sx={{ '& td': { py: 3 } }}>*/}
            {/*                            <TableCell>*/}
            {/*                                <Typography fontWeight="bold" variant="subtitle1">*/}
            {/*                                    {appt.listing.title}*/}
            {/*                                </Typography>*/}
            {/*                                <Typography variant="body2" color="text.secondary">*/}
            {/*                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(appt.listing.price)}*/}
            {/*                                </Typography>*/}
            {/*                            </TableCell>*/}

            {/*                            <TableCell>*/}
            {/*                                <Typography variant="body1">{appt.buyer.name}</Typography>*/}
            {/*                            </TableCell>*/}

            {/*                            <TableCell>*/}
            {/*                                <Typography variant="body1">*/}
            {/*                                    {format(new Date(appt.scheduled_at), "PPpp")}*/}
            {/*                                </Typography>*/}
            {/*                            </TableCell>*/}

            {/*                            <TableCell>*/}
            {/*                                /!* 5. Custom styled Chip for status matching image_18.png *!/*/}
            {/*                                <Chip*/}
            {/*                                    label={appt.status.replace(/_/g, ' ')}*/}
            {/*                                    sx={{*/}
            {/*                                        bgcolor: statusStyle.bg,*/}
            {/*                                        color: statusStyle.color,*/}
            {/*                                        fontWeight: 600,*/}
            {/*                                        fontSize: '0.875rem',*/}
            {/*                                        height: 'auto',*/}
            {/*                                        py: 0.5,*/}
            {/*                                        textTransform: 'lowercase', //*/}
            {/*                                        '& .MuiChip-label': { px: 1.5 }*/}
            {/*                                    }}*/}
            {/*                                />*/}
            {/*                            </TableCell>*/}

            {/*                            <TableCell align="right">*/}
            {/*                                {appt.status === "pending" && (*/}
            {/*                                    <Box display="flex" justifyContent="flex-end" gap={1}>*/}
            {/*                                        /!* 6. Style Approve button (Green, Rounded) *!/*/}
            {/*                                        <Button*/}
            {/*                                            variant="contained"*/}
            {/*                                            sx={{*/}
            {/*                                                bgcolor: '#10B981',*/}
            {/*                                                '&:hover': { bgcolor: '#059669' },*/}
            {/*                                                borderRadius: 2,*/}
            {/*                                                fontWeight: 600,*/}
            {/*                                                px: 2*/}
            {/*                                            }}*/}
            {/*                                            size="small"*/}
            {/*                                            onClick={() => openApproveDialog(appt.id)}*/}
            {/*                                        >*/}
            {/*                                            Approve*/}
            {/*                                        </Button>*/}

            {/*                                        /!* 7. Style Reject button (Red Outline, Rounded) *!/*/}
            {/*                                        <Button*/}
            {/*                                            variant="outlined"*/}
            {/*                                            sx={{*/}
            {/*                                                color: '#EF4444',*/}
            {/*                                                borderColor: '#EF4444',*/}
            {/*                                                '&:hover': { borderColor: '#DC2626', bgcolor: alpha('#EF4444', 0.05) },*/}
            {/*                                                borderRadius: 2,*/}
            {/*                                                fontWeight: 600,*/}
            {/*                                                px: 2*/}
            {/*                                            }}*/}
            {/*                                            size="small"*/}
            {/*                                            onClick={() => openRejectDialog(appt.id)}*/}
            {/*                                        >*/}
            {/*                                            Reject*/}
            {/*                                        </Button>*/}
            {/*                                    </Box>*/}
            {/*                                )}*/}
            {/*                            </TableCell>*/}
            {/*                        </TableRow>*/}
            {/*                    );*/}
            {/*                })}*/}
            {/*            </TableBody>*/}
            {/*        </Table>*/}
            {/*    </Card>*/}
            {/*</Box>*/}

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
                        sx={{ mt: 1 }}
                    />}
            />

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
                        sx={{ mt: 1 }}
                    />
                }
            />
        </AuthenticatedLayout>
    );
}
