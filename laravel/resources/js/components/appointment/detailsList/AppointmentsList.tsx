import { useState, useMemo } from 'react';
import type { SyntheticEvent } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Chip,
    TextField,
    useMediaQuery,
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
    const [currentTab, setCurrentTab] = useState<FilterType>('today');
    const { showNotification } = useNotification();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Dialog State
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    const [selectedApptId, setSelectedApptId] = useState<number | null>(null);
    const [accessCode, setAccessCode] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");

    const handleTabChange = (_event: SyntheticEvent, newValue: FilterType) => {
        setCurrentTab(newValue);
    };

    // --- Filter Logic ---
    const filteredAppointments = useMemo(() => {
        return appointments.filter((apt) => {
            if (!apt.listing) return false;

            const aptDate = parseISO(apt.scheduled_at);

            switch (currentTab) {
                case 'all': return true;
                case 'today': return isToday(aptDate) && apt.status !== 'rejected' && apt.status !== 'cancelled by buyer';
                case 'upcoming': return isFuture(aptDate) && !isToday(aptDate) && apt.status !== 'rejected' && apt.status !== 'cancelled by buyer';
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
            sx={{
                width: '100%',
                minWidth: 0,
                backgroundColor: theme.palette.background.white,
                p: { xs: 2, md: theme.shape.padding },
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.border.main}`

            }}>

            {/* Header & Tabs */}
            <Box sx={{ mb: { xs: 2.5, md: 4 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1.5,
                        mb: { xs: 2, md: 3 },
                    }}
                >
                    <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
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
                    variant={isMobile ? 'standard' : 'scrollable'}
                    scrollButtons={isMobile ? false : 'auto'}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        maxWidth: '100%',
                        '& .MuiTabs-scroller': {
                            overflow: { xs: 'visible !important', sm: 'auto !important' },
                        },
                        '& .MuiTabs-list': {
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            gap: { xs: 1, sm: 0 },
                        },
                        '& .MuiTabs-indicator': {
                            display: { xs: 'none', sm: 'block' },
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: { xs: 42, md: 48 },
                            minWidth: { xs: 'auto', sm: 90 },
                            px: { xs: 1.25, sm: 2 },
                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                            borderRadius: { xs: '999px', sm: 0 },
                            border: { xs: `1px solid ${theme.palette.border.main}`, sm: 'none' },
                        },
                        '& .MuiTab-root.Mui-selected': {
                            bgcolor: { xs: 'rgba(87, 42, 77, 0.08)', sm: 'transparent' },
                        }
                    }}
                >
                    <Tab label="Today" value="today" />
                    <Tab label="Upcoming" value="upcoming" />
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
                    maxHeight: { xs: 'none', md: '750px' },
                    overflowY: { xs: 'visible', md: 'auto' },
                    pr: { xs: 0, md: 1 },
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
                            p: { xs: 3, md: 8 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            bgcolor: theme.palette.background.white,
                            color: theme.palette.primary.main,
                            borderRadius: theme.shape.borderRadius,
                            border: '1px dashed',
                            borderColor: 'divider'
                        }}
                    >
                        <Box sx={{
                            bgcolor: theme.palette.background.white,
                            color: theme.palette.primary.main,
                            borderRadius: theme.shape.borderRadius,
                            padding: theme.shape.padding,
                        }}>
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
                onClose={() => setRejectDialogOpen(false)}
                onConfirm={confirmReject}
            />
        </Box>
    );
}
