import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { isToday, isFuture, isPast, parseISO } from 'date-fns';
import AppointmentItem from './AppointmentItem';
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
            setCancelDialogOpen(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            showNotification("Failed to cancel appointment", "error");
            setCancelDialogOpen(false);
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
                access_code: accessCode
            });
            showNotification(response.message || "Appointment approved", "success");
            setApproveDialogOpen(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            showNotification("Failed to approve appointment", "error");
            setApproveDialogOpen(false);
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
                rejection_reason: rejectionReason
            });
            showNotification(response.message || "Appointment rejected", "success");
            setRejectDialogOpen(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            showNotification("Failed to reject appointment", "error");
            setRejectDialogOpen(false);
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

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Cancel Appointment?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setCancelDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Keep Appointment</Button>
                    <Button onClick={confirmCancel} variant="contained" color="error" sx={{ fontWeight: 600, borderRadius: 2 }}>Yes, Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Approve Dialog */}
            <Dialog
                open={approveDialogOpen}
                onClose={() => setApproveDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 400 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Approve Appointment</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>Please provide an access code.</DialogContentText>
                    <TextField autoFocus margin="dense" label="Access Code" fullWidth value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setApproveDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={confirmApprove} variant="contained" color="primary">Approve</Button>
                </DialogActions>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                open={rejectDialogOpen}
                onClose={() => setRejectDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 400 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Reject Appointment</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>Please provide a reason.</DialogContentText>
                    <TextField autoFocus margin="dense" label="Reason" fullWidth multiline minRows={3} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setRejectDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={confirmReject} variant="contained" color="error">Reject</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
