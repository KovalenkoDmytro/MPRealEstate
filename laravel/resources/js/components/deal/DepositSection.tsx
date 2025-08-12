import React, { useState, useMemo } from "react";
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

export default function DepositSection({ deal }: { deal: Deal }) {
    const [confirmed, setConfirmed] = useState(false);
    const [depositDateTime, setDepositDateTime] = useState<Date | null>(new Date());
    const [confirmOpen, setConfirmOpen] = useState(false);

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
        // If your API expects a string, use depositDateTime!.toISOString()
        await DealService.markDepositMade(deal.id, depositDateTime as Date);
        alert("Deposit confirmed successfully!");
        window.location.reload();
    };

    // Don't render if deposit isn't required or already made
    if (!deal.security_deposit || deal.is_security_deposit_made) return null;

    return (
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                💸 Security Deposit
            </Typography>

            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
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
                    disabled={!canSubmit}
                >
                    Confirm Deposit
                </Button>
            </Box>

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
