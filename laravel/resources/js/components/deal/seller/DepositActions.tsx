import { useCallback, useState } from "react";
import { PropertyDetail } from "@/types";
import {
    Card, CardContent, CardActions, Typography, Button,
    Alert, CircularProgress, Stack, Box
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import DealStatusBanner from "@/components/deal/DealStatusBanner";
import { DealService } from "@/services/dealService";
import ConfirmDialog from "@/components/ConfirmDialog";
import SetDepositForm from "@/components/deal/seller/SetDepositForm";
import {useNotification} from "@/context/NotificationContext";


export default function DepositActions({ deal }: { deal: PropertyDetail }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [depositDateTime, setDepositDateTime] = useState<Date | null>(new Date());
    const {setRedirectNotification } = useNotification();

    const handleConfirm = useCallback(async () => {
        if (!depositDateTime) return;
        try {
            setError(null);
            setSubmitting(true);

            const response = await DealService.confirmDeposit(deal.id, depositDateTime);
            setRedirectNotification(response.message, response.status);
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
        < >
            {/* banner always on top */}
            <DealStatusBanner deal={deal} role="seller" feature="deposit" />

            {/* if no deposit exists yet, show SetDepositForm */}
            {!deal.security_deposit && <SetDepositForm deal={deal} />}

            {/* confirmation card only when buyer marked deposit as made, but not confirmed */}
            {deal.is_security_deposit_made && !deal.is_security_deposit_confirmed && (
                <Card variant="outlined" sx={{ mt: 3, bgcolor: "warning.50" as any }}>
                    <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <LockIcon color="warning" />
                            <Typography variant="h6" color="warning.dark">
                                Confirm Security Deposit
                            </Typography>
                        </Stack>

                        <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
                            The buyer has marked the security deposit as made. Please review the confirmation and confirm.
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
            )}
        </>
    );
}
