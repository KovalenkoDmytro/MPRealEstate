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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";

// MUI X date pickers
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {DealService} from "@/services/dealService";

// Assumes a global `route()` helper (e.g., Ziggy) and a CSRF token meta tag.
export default function DepositActions({ deal }: { deal: PropertyDetail }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // prefill with now; or set to null if you want to require explicit user selection
    const [depositDateTime, setDepositDateTime] = useState<Date>(new Date());

    if (!deal.is_security_deposit_made || deal.is_security_deposit_confirmed) return null;

    const handleConfirm = useCallback(async () => {
        try {
            setError(null);
            setSubmitting(true);


            const res = await DealService.confirmDeposit(deal.id,  depositDateTime)

            if (!res.ok) {
                const text = await res.message;
                throw new Error(text || `Request failed with ${res.status}`);
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
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setConfirmOpen(true)}
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <CircularProgress size={18} sx={{ mr: 1 }} /> Confirming...
                        </>
                    ) : (
                        "Confirm Deposit"
                    )}
                </Button>
            </CardActions>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm deposit received?</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        This will mark the buyer&apos;s security deposit as confirmed.
                    </DialogContentText>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="I confirm I have received the security deposit."
                            value={depositDateTime}
                            onChange={(newValue) => setDepositDateTime(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        disabled={submitting || !depositDateTime}
                    >
                        {submitting ? <CircularProgress size={18} /> : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
