import { useState, FormEvent, useMemo } from "react";
import { Box, Typography, Alert, Paper, Chip } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { appointmentService } from "@/services/appointmentService";
import { formatWithTimezone } from "@/helpers/dateHelpers";
import { useNotification } from "@/context/NotificationContext";
import { extractErrorMessage } from "@/helpers/errorHelpers";
import { RealEstateListing, Appointment } from "@/types";
import theme from "@/theme";
import Button from "@/components/common/Button";

const isActive = (status: Appointment['status']) =>
    ['pending', 'accepted'].includes(status);

export default function SetAppointmentForm({ listing }: { listing: RealEstateListing }) {
    const [scheduledAt, setScheduledAt] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { showNotification } = useNotification();

    const appointments = listing.appointments || [];

    // 1. Check for any currently active appointment (Pending or Accepted)
    const activeAppointment = useMemo(() => {
        return appointments.find(apt => isActive(apt.status));
    }, [appointments]);

    // 2. If no active appointment, find the most recent rejection to show context
    const latestRejected = useMemo(() => {
        if (activeAppointment) return null;

        // Filter for rejected items and sort by ID (descending) to get the newest
        const rejected = appointments.filter(apt => apt.status === 'rejected');
        return rejected.sort((a, b) => b.id - a.id)[0] || null;
    }, [appointments, activeAppointment]);

    // Disable form only if there is an ACTIVE appointment or we just submitted
    const isDisabled = !!activeAppointment || isSubmitted;

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await appointmentService.create({
                listing_id: listing.id,
                scheduled_at: scheduledAt,
            });

            showNotification(response.message, response.status);
            setIsSubmitted(true);
        } catch (err: any) {
            const errorMsg = extractErrorMessage(err.response);
            showNotification(errorMsg, "error");
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: theme.shape.padding, borderRadius: theme.shape.borderRadius }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                    component="form"
                    onSubmit={submit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Schedule a Viewing</Typography>
                        {activeAppointment && (
                            <Chip
                                label={activeAppointment.status.toUpperCase()}
                                color={activeAppointment.status === 'accepted' ? 'success' : 'info'}
                                size="small"
                            />
                        )}
                    </Box>


                    {/* Case 1: Accepted */}
                    {activeAppointment?.status === 'accepted' && (
                        <Alert severity="success">
                            <strong>Visit Confirmed!</strong><br />
                            You are scheduled to visit on: <br />
                            {new Date(activeAppointment.scheduled_at).toLocaleString()}
                            <Typography>
                                Access code : {activeAppointment.access_code}
                            </Typography>

                        </Alert>
                    )}

                    {/* Case 2: Pending */}
                    {activeAppointment?.status === 'pending' && (
                        <Alert severity="info">
                            <strong>Request Sent.</strong><br />
                            Waiting for seller approval for: <br />
                            {new Date(activeAppointment.scheduled_at).toLocaleString()}
                        </Alert>
                    )}

                    {/* Case 3: Just Submitted */}
                    {isSubmitted && !activeAppointment && (
                        <Alert severity="success">
                            <strong>Success!</strong><br />
                            Your appointment request has been submitted successfully! <br />
                            It is under consideration; please wait for the seller to respond.
                        </Alert>
                    )}

                    {/* Case 4: REJECTED - Show Reason Here */}
                    {!isDisabled && latestRejected && (
                        <Alert severity="warning">
                            <Typography variant="subtitle2" fontWeight="bold">
                                Your previous request was declined.
                            </Typography>

                            {/* Display the rejection reason if it exists */}
                            {latestRejected.rejection_reason && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                    " {latestRejected.rejection_reason} "
                                </Typography>
                            )}

                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Please select a different time or date below.
                            </Typography>
                        </Alert>
                    )}

                    {/* --- FORM SECTION --- */}

                    <DateTimePicker
                        label="Choose Date & Time"
                        disabled={isDisabled}
                        value={scheduledAt ? new Date(scheduledAt) : null}
                        disablePast
                        onChange={(value) =>
                            setScheduledAt(value ? formatWithTimezone(value) : "")
                        }
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: true,
                            }
                        }}
                    />

                    <Button
                        version="primary"
                        text={activeAppointment ? "Request Active" : "Request Visit"}
                        disabled={isDisabled}
                        type="submit"
                    />

                </Box>
            </LocalizationProvider>
        </Paper>
    );
}
