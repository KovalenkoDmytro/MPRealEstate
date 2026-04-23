import React, { useMemo, useState } from "react";
import { DealService } from "@/services/dealService";
import { Deal } from "@/types";

import {
    Box,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { format } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import DealStatusBanner from "@/components/deal/DealStatusBanner";

export default function DepositSection({ deal }: { deal: Deal }) {
    const [confirmed, setConfirmed] = useState(false);
    const [depositDateTime, setDepositDateTime] = useState<Date | null>(new Date());
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Don't render if deposit isn't required
    if (!deal.security_deposit) return null;

    const canSubmit = useMemo(
        () => confirmed && !!depositDateTime,
        [confirmed, depositDateTime]
    );


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) {
            alert("Please confirm deposit and select date/time.");
            return;
        }
        setConfirmOpen(true);
    };

    const save = async () => {
        try {
            setSubmitting(true);
            await DealService.markDepositMade(deal.id, depositDateTime as Date);
            alert("Deposit confirmed successfully!");
            window.location.reload();
        } catch (e: any) {
            alert(e?.message || "Failed to confirm deposit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box

        >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                💸 Security Deposit
            </Typography>

            <DealStatusBanner deal={deal} role="buyer" feature="deposit" />


            {/* Show form only if deposit not yet marked as made */}
            {!deal.is_security_deposit_made && (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                            />
                        }
                        label="I confirm I have made the security deposit."
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Deposit received date & time"
                            value={depositDateTime}
                            onChange={(newValue) => setDepositDateTime(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>

                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={!canSubmit || submitting}
                    >
                        {submitting ? "Saving..." : "Confirm Deposit"}
                    </Button>
                </Box>
            )}

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Confirm Security Deposit?"
                description={
                    <div>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            You’re about to confirm the security deposit for this deal.
                        </Typography>
                        <Typography variant="body2">
                            <strong>Confirmed by checkbox:</strong> {confirmed ? "Yes" : "No"}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Deposit date & time:</strong>{" "}
                            {depositDateTime ? format(depositDateTime, "PPpp") : "—"}
                        </Typography>
                    </div>
                }
                confirmLabel="Confirm"
                confirmColor="success"
                onConfirm={save}
            />
        </Box>
    );
}
