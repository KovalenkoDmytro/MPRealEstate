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
import { InfoBlock } from "@/components/InfoBlock"; // keep as named if your component exports named

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

    // Single banner derived from deal state
    const banner = useMemo(() => {
        // 1) Final state: confirmed
        if (deal.is_security_deposit_confirmed && deal.security_deposit_confirmed_at) {
            return {
                type: "success" as const,
                title: "Security deposit confirmed",
                message: `Seller confirmed receiving ${deal.security_deposit} on ${deal.security_deposit_confirmed_at}.`,
            };
        }

        // 2) Pending seller confirmation (you already marked deposit made)
        if (deal.security_deposit_made_at && !deal.is_security_deposit_confirmed) {
            return {
                type: "warning" as const,
                title: "Awaiting confirmation",
                message: "Please wait for the seller to confirm receipt of your security deposit.",
            };
        }

        // 3) Action required (seller set a deposit; you haven’t marked it as made yet)
        if (deal.security_deposit && !deal.is_security_deposit_made) {
            return {
                type: "warning" as const,
                title: "Action required",
                message: `Seller set a required security deposit of ${deal.security_deposit}. Please make the deposit and confirm the date & time below.`,
            };
        }

        return null;
    }, [
        deal.security_deposit,
        deal.is_security_deposit_made,
        deal.security_deposit_made_at,
        deal.is_security_deposit_confirmed,
        deal.security_deposit_confirmed_at,
    ]);

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
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                💸 Security Deposit
            </Typography>

            {banner && (
                <Box mb={2}>
                    <InfoBlock type={banner.type} title={banner.title} message={banner.message} />
                </Box>
            )}

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
