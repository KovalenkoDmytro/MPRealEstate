import { useState, FormEvent, useMemo } from "react";
import { Box, Typography, Alert, Paper, Chip, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, set, isToday, isBefore } from "date-fns";
import { appointmentService } from "@/services/appointmentService";
import { formatWithTimezone } from "@/helpers/dateHelpers";
import { useNotification } from "@/context/NotificationContext";
import { extractErrorMessage } from "@/helpers/errorHelpers";
import { RealEstateListing, Appointment } from "@/types";
import theme from "@/theme";
import Button from "@/components/common/Button";

interface TimeSlot {
    hour: number;
    minute: number;
    label: string;
}

const TIME_SLOTS: TimeSlot[] = Array.from({ length: 25 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const label = format(set(new Date(), { hours: hour, minutes: minute, seconds: 0 }), 'h:mm a');
    return { hour, minute, label };
});

const isActive = (status: Appointment['status']) =>
    ['pending', 'accepted'].includes(status);

export default function SetAppointmentForm({ listing }: { listing: RealEstateListing }) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [slotError, setSlotError] = useState<string | null>(null);
    const { showNotification } = useNotification();

    const appointments = listing.appointments || [];

    const activeAppointment = useMemo(() =>
        appointments.find(apt => isActive(apt.status)),
    [appointments]);

    const latestRejected = useMemo(() => {
        if (activeAppointment) return null;
        const rejected = appointments.filter(apt => apt.status === 'rejected');
        return rejected.sort((a, b) => b.id - a.id)[0] || null;
    }, [appointments, activeAppointment]);

    const isDisabled = !!activeAppointment || isSubmitted || isLoading;

    const isSlotPast = (slot: TimeSlot): boolean => {
        if (!selectedDate || !isToday(selectedDate)) return false;
        const slotTime = set(new Date(), { hours: slot.hour, minutes: slot.minute, seconds: 0, milliseconds: 0 });
        return isBefore(slotTime, new Date());
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedSlot) return;

        setIsLoading(true);
        setSlotError(null);

        const datetime = set(selectedDate, {
            hours: selectedSlot.hour,
            minutes: selectedSlot.minute,
            seconds: 0,
            milliseconds: 0,
        });

        try {
            const response = await appointmentService.create({
                listing_id: listing.id,
                scheduled_at: formatWithTimezone(datetime),
            });

            showNotification(response.message, response.status);
            setIsSubmitted(true);
        } catch (err: any) {
            const fieldError = err.response?.data?.errors?.scheduled_at?.[0];
            if (fieldError) {
                setSlotError(fieldError);
            } else {
                showNotification(extractErrorMessage(err.response), "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: theme.shape.padding, borderRadius: theme.shape.borderRadius, position: "relative" }}>
            {isLoading && (
                <Box sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.75)",
                    borderRadius: "inherit",
                    zIndex: 1,
                }}>
                    <CircularProgress />
                </Box>
            )}
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
                            You are scheduled to visit on:{" "}
                            {new Date(activeAppointment.scheduled_at).toLocaleString()}
                            <Typography>Access code: {activeAppointment.access_code}</Typography>
                        </Alert>
                    )}

                    {/* Case 2: Pending */}
                    {activeAppointment?.status === 'pending' && (
                        <Alert severity="info">
                            <strong>Request Sent.</strong><br />
                            Waiting for seller approval for:{" "}
                            {new Date(activeAppointment.scheduled_at).toLocaleString()}
                        </Alert>
                    )}

                    {/* Case 3: Just Submitted */}
                    {isSubmitted && !activeAppointment && (
                        <Alert severity="success">
                            <strong>Success!</strong><br />
                            Your appointment request has been submitted successfully!<br />
                            It is under consideration; please wait for the seller to respond.
                        </Alert>
                    )}

                    {/* Case 4: Rejected */}
                    {!isDisabled && latestRejected && (
                        <Alert severity="warning">
                            <Typography variant="subtitle2" fontWeight="bold">
                                Your previous request was declined.
                            </Typography>
                            {latestRejected.rejection_reason && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                    "{latestRejected.rejection_reason}"
                                </Typography>
                            )}
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Please select a different time or date below.
                            </Typography>
                        </Alert>
                    )}

                    <DatePicker
                        label="Choose Date"
                        disabled={isDisabled}
                        value={selectedDate}
                        disablePast
                        onChange={(value) => {
                            setSelectedDate(value);
                            setSelectedSlot(null);
                            setSlotError(null);
                        }}
                        slotProps={{
                            textField: { fullWidth: true, required: true }
                        }}
                    />

                    {selectedDate && !isDisabled && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Select Time
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {TIME_SLOTS.map((slot) => {
                                    const past = isSlotPast(slot);
                                    const isSelected = selectedSlot?.hour === slot.hour && selectedSlot?.minute === slot.minute;
                                    return (
                                        <Chip
                                            key={slot.label}
                                            label={slot.label}
                                            clickable={!past}
                                            disabled={past}
                                            color={isSelected ? 'primary' : 'default'}
                                            variant={isSelected ? 'filled' : 'outlined'}
                                            onClick={past ? undefined : () => {
                                                setSelectedSlot(slot);
                                                setSlotError(null);
                                            }}
                                            size="small"
                                        />
                                    );
                                })}
                            </Box>
                        </Box>
                    )}

                    {slotError && (
                        <Alert severity="error">
                            <strong>Time slot unavailable.</strong> {slotError}
                        </Alert>
                    )}

                    <Button
                        version="primary"
                        text={activeAppointment ? "Request Active" : "Request Visit"}
                        disabled={isDisabled || !selectedDate || !selectedSlot}
                        type="submit"
                    />
                </Box>
            </LocalizationProvider>
        </Paper>
    );
}
