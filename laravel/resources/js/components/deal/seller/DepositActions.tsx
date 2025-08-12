import * as React from "react";
import { useCallback, useState } from "react";
import { PropertyDetail } from "@/types";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Stack,
    Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

import { DealService } from "@/services/dealService";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function DepositActions({ deal }: { deal: PropertyDetail }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // prefill with now; set to null if you want to force explicit selection
    const [depositDateTime, setDepositDateTime] = useState<Date | null>(new Date());

    // Only render when buyer marked as made, and it’s NOT yet confirmed
    if (!deal.is_security_deposit_made || deal.is_security_deposit_confirmed) return null;


    const handleConfirm = useCallback(async () => {
        if (!depositDateTime) return;

        try {
            setError(null);
            setSubmitting(true);

            // If backend expects ISO string:
            // const res = await DealService.confirmDeposit(deal.id, depositDateTime.toISOString());
            const res = await DealService.confirmDeposit(deal.id, depositDateTime);

            // Adjust this check to match your service shape
            if (res?.status !== "success") {
                throw new Error(res?.message || "Failed to confirm deposit.");
            }

            window.location.reload();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Something went wrong.";
            setError(msg);
        } finally {
            setSubmitting(false);
            setConfirmOpen(false);
        }
    }, [deal.id, depositDateTime]);

    return (
        <Card variant="outlined" sx={{ mt: 3, bgcolor: "warning.50" as any }}>
            <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                    <LockIcon color="warning" />
                    <Typography variant="h6" color="warning.dark">
                        Confirm Security Deposit
                    </Typography>
                </Stack>

                <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
                    The buyer has marked the security deposit as made. Please review the uploaded
                    confirmation file and confirm.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    startIcon={submitting ? <CircularProgress size={18} /> : <CheckCircleIcon />}
                    onClick={() => setConfirmOpen(true)}
                    disabled={submitting}
                >
                    {submitting ? "Confirming..." : "Confirm Deposit"}
                </Button>
            </CardActions>

            {/* Confirmation dialog (reusable) */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Confirm deposit received?"
                description={
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            This will mark the buyer’s security deposit as <strong>confirmed</strong>.
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Deposit received date & time"
                                value={depositDateTime}
                                onChange={(dt) => setDepositDateTime(dt)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>

                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                            Selected: {depositDateTime ? format(depositDateTime, "PPpp") : "—"}
                        </Typography>
                    </Box>
                }
                confirmLabel="Confirm"
                confirmColor="success"
                onConfirm={handleConfirm}
            />
        </Card>
    );
}
