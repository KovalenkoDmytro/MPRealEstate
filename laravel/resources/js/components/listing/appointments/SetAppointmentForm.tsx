import React, { useState, FormEvent } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { appointmentService } from "@/services/appointmentService";
import { formatWithTimezone } from "@/helpers/dateHelpers";
import { useNotification } from "@/context/NotificationContext";
import { extractErrorMessage } from "@/helpers/errorHelpers";
import { RealEstateListing } from "@/types";
import { getLatestPendingAppointment } from "@/components/listing/appointments/appointmentHelpers";

export default function SetAppointmentForm({ listing }: { listing: RealEstateListing }) {
    const [scheduledAt, setScheduledAt] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { showNotification } = useNotification();

    const appointments = listing.appointments || [];
    const latestPending = getLatestPendingAppointment(appointments);

    const isDisabled = latestPending !== null || isSubmitted;

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await appointmentService.create({
                listing_id: listing.id,
                scheduled_at: scheduledAt,
            });

            showNotification(response.message, response.status);
            setIsSubmitted(true);   // ⬅ disable controls

        } catch (err: any) {
            const errorMsg = extractErrorMessage(err.response);
            showNotification(errorMsg, "error");
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
                component="form"
                onSubmit={submit}
                sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}
            >
                <Typography variant="h6">Schedule a Viewing</Typography>

                {latestPending && (
                    <Alert severity="info">
                        You already have a pending appointment scheduled for: <br />
                        <strong>{new Date(latestPending.scheduled_at).toLocaleString()}</strong>
                    </Alert>
                )}

                {isSubmitted && !latestPending && (
                    <Alert severity="success">
                        Your appointment has been submitted!
                    </Alert>
                )}

                <DateTimePicker
                    label="Choose Date & Time"
                    disabled={isDisabled}
                    value={scheduledAt ? new Date(scheduledAt) : null}
                    minDate={new Date()}
                    onChange={(value) =>
                        setScheduledAt(value ? formatWithTimezone(value) : "")
                    }
                    slotProps={{
                        textField: { fullWidth: true, required: true }
                    }}
                />

                <Button disabled={isDisabled} type="submit" variant="contained" size="large">
                    Request Visit
                </Button>
            </Box>
        </LocalizationProvider>
    );
}
