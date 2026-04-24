import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Chip,
    TextField,
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { isToday, isFuture, isPast, parseISO } from 'date-fns';
import AppointmentItem from './AppointmentItem';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useNotification } from '@/context/NotificationContext';
import { AppointmentWithListingSeller, AppointmentWithListingBuyer } from "@/types";
import { appointmentService } from "@/services/appointmentService";
import theme from "@/theme";

type FilterType = 'all' | 'today' | 'upcoming' | 'past' | 'accepted' | 'pending' | 'rejected' | 'cancelled';

interface AppointmentsListProps {
    appointments: AppointmentWithListingSeller[] | AppointmentWithListingBuyer[];
}

export default function AppointmentsList({ appointments }: AppointmentsListProps) {
    const [currentTab, setCurrentTab] = useState<FilterType>('upcoming');
    const { showNotification } = useNotification();

    // Dialog State
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    const [selectedApptId, setSelectedApptId] = useState<number | null>(null);
    const [accessCode, setAccessCode] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");

    const handleTabChange = (event: React.SyntheticEvent, newValue: FilterType) => {
        setCurrentTab(newValue);
    };

    // --- Filter Logic ---
    const filteredAppointments = useMemo(() => {
        return appointments.filter((apt) => {
            if (!apt.listing) return false;

            const aptDate = parseISO(apt.scheduled_at);

            switch (currentTab) {
                case 'all': return true;
                case 'today': return isToday(aptDate);
                case 'upcoming': return isFuture(aptDate) && !isToday(aptDate);
                case 'past': return isPast(aptDate) && !isToday(aptDate);
                case 'accepted': return apt.status === 'accepted';
                case 'pending': return apt.status === 'pending';
                case 'rejected': return apt.status === 'rejected';
                case 'cancelled': return apt.status === 'cancelled by buyer';
                default: return true;
            }
        }).sort((a, b) => {
            const dateA = new Date(a.scheduled_at).getTime();
            const dateB = new Date(b.scheduled_at).getTime();
            if (['past', 'rejected', 'cancelled'].includes(currentTab)) return dateB - dateA;
            return dateA - dateB;
        });
    }, [appointments, currentTab]);

    // --- Buyer: Cancel Handlers ---
    const openCancelDialog = (id: number) => {
        setSelectedApptId(id);
        setCancelDialogOpen(true);
    };

    const confirmCancel = async () => {
        if (!selectedApptId) return;

        try {
            const response = await appointmentService.buyerCancel({ appointment_id: selectedApptId });
            showNotification(response.message || "Appointment cancelled", "success");
            window.location.reload();
        } catch (err: any) {
            showNotification(err?.response?.data?.message || "Failed to cancel appointment", "error");
            return false;
        }
    };

    // --- Seller: Approve Handlers ---
    const openApproveDialog = (id: number) => {
        setSelectedApptId(id);
        setAccessCode("");
        setApproveDialogOpen(true);
    };

    const confirmApprove = async () => {
        if (!selectedApptId) return;

        try {
            const response = await appointmentService.handle({
                appointment_id: selectedApptId,
                action: 'approve',
                access_code: accessCode,
            });
            showNotification(response.message || "Appointment approved", "success");
            window.location.reload();
        } catch (err: any) {
            showNotification(err?.response?.data?.message || "Failed to approve appointment", "error");
            return false;
        }
    };

    // --- Seller: Reject Handlers ---
    const openRejectDialog = (id: number) => {
        setSelectedApptId(id);
        setRejectionReason("");
        setRejectDialogOpen(true);
    };

    const confirmReject = async () => {
        if (!selectedApptId) return;

        try {
            const response = await appointmentService.handle({
                appointment_id: selectedApptId,
                action: 'reject',
                rejection_reason: rejectionReason,
            });
            showNotification(response.message || "Appointment rejected", "success");
            window.location.reload();
        } catch (err: any) {
            showNotification(err?.response?.data?.message || "Failed to reject appointment", "error");
            return false;
        }
    };

    return (
        <Box
            sx={{ width: '100%',
                backgroundColor: theme.palette.background.white,
                padding: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.border.main}`

            }}>

            {/* Header & Tabs */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Typography variant="h5" fontWeight={700}>
                        All Appointments
                    </Typography>
                    <Chip
                        label={`${filteredAppointments.length} Total`}
                        size="small"
                        sx={{ bgcolor: 'rgba(87, 42, 77, 0.08)', color: 'primary.main', fontWeight: 700 }}
                    />
                </Box>

                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 48,
                        }
                    }}
                >
                    <Tab label="Upcoming" value="upcoming" />
                    <Tab label="Today" value="today" />
                    <Tab label="Confirmed" value="accepted" />
                    <Tab label="Pending" value="pending" />
                    <Tab label="Past" value="past" />
                    <Tab label="Rejected" value="rejected" />
                    <Tab label="Cancelled" value="cancelled" />
                    <Tab label="All" value="all" />
                </Tabs>
            </Box>

            {/* List Container */}
            <Box
                sx={{
                    maxHeight: '750px',
                    overflowY: 'auto',
                    pr: 1, // Padding right to prevent scrollbar overlapping content
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                    },
                }}
            >
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt) => (
                        <AppointmentItem
                            key={apt.id}
                            appointment={apt}
                            onCancel={openCancelDialog}
                            onApprove={openApproveDialog}
                            onReject={openRejectDialog}
                        />
                    ))
                ) : (
                    /* Empty State */
                    <Box
                        sx={{
                            p: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: 4,
                            border: '1px dashed',
                            borderColor: 'divider'
                        }}
                    >
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: '50%', mb: 2 }}>
                            <CalendarMonth sx={{ fontSize: 40, color: 'text.disabled' }} />
                        </Box>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No appointments found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            No {currentTab === 'all' ? '' : currentTab} appointments to display.
                        </Typography>
                    </Box>
                )}
            </Box>

            <ConfirmDialog
                open={cancelDialogOpen}
                title="Cancel Appointment?"
                description="Are you sure you want to cancel this appointment? This action cannot be undone."
                confirmLabel="Yes, Cancel"
                cancelLabel="Keep Appointment"
                confirmColor="error"
                onClose={() => setCancelDialogOpen(false)}
                onConfirm={confirmCancel}
            />

            <ConfirmDialog
                open={approveDialogOpen}
                title="Approve Appointment"
                description={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Please provide an access code for the visitor.
                        </Typography>
                        <TextField
                            autoFocus
                            fullWidth
                            label="Access Code"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                        />
                    </Box>
                }
                confirmLabel="Approve"
                confirmColor="primary"
                onClose={() => setApproveDialogOpen(false)}
                onConfirm={confirmApprove}
            />

            <ConfirmDialog
                open={rejectDialogOpen}
                title="Reject Appointment"
                description={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Please provide a reason for rejecting this appointment.
                        </Typography>
                        <TextField
                            autoFocus
                            fullWidth
                            multiline
                            minRows={3}
                            label="Rejection Reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </Box>
                }
                confirmLabel="Reject"
                confirmColor="error"
                onClose={() => setRejectDialogOpen(false)}
                onConfirm={confirmReject}
            />
        </Box>
    );
}
