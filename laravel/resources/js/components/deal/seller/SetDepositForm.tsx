import React, { useMemo, useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function SetDepositForm({ deal }: { deal: Deal }) {
    const [depositAmount, setDepositAmount] = useState<number | ''>('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Only show if deposit is NOT set yet
    if (deal.security_deposit) {
        return (
            <p className="text-green-600 font-medium mt-4">
                Security deposit already set: ${deal.security_deposit}
            </p>
        );
    }

    const amountNumber = typeof depositAmount === "number" ? depositAmount : parseFloat(depositAmount || "0");
    const canSubmit = useMemo(() => !Number.isNaN(amountNumber) && amountNumber > 0, [amountNumber]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) {
            alert("Please enter a valid deposit amount greater than 0.");
            return;
        }
        setConfirmOpen(true);
    };

    const save = async () => {
        const res = await DealService.setDeposit(deal.id, Number(amountNumber.toFixed(2)));
        if (res.status !== "success") throw new Error("Failed to set deposit");
        alert("Deposit saved successfully!");
        window.location.reload();
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 4, p: 4, borderRadius: 2, backgroundColor: "#f9fafb" }}
        >
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Set Security Deposit Amount
            </Typography>

            <TextField
                type="number"
                label="Enter deposit amount"
                fullWidth
                variant="outlined"
                required
                slotProps={{htmlInput :{ step: "0.01", min: "0" }}}
                value={depositAmount}
                onChange={(e) => {
                    const v = e.target.value;
                    // allow empty while typing
                    if (v === "") return setDepositAmount("");
                    const n = parseFloat(v);
                    if (Number.isNaN(n)) return;
                    setDepositAmount(n);
                }}
                onBlur={(e) => {
                    const v = e.target.value;
                    if (v === "") return;
                    const n = parseFloat(v);
                    if (!Number.isNaN(n)) setDepositAmount(Number(n.toFixed(2)));
                }}
                error={depositAmount !== "" && !canSubmit}
                helperText={depositAmount !== "" && !canSubmit ? "Amount must be greater than 0." : " "}
            />

            <Box mt={2}>
                <Button type="submit" variant="contained" color="primary" disabled={!canSubmit}>
                    Save Deposit
                </Button>
            </Box>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Confirm Deposit Amount?"
                description={
                    <Typography variant="body2" color="text.secondary">
                        You’re about to set the security deposit to{" "}
                        <strong>${amountNumber.toFixed(2)}</strong>. Continue?
                    </Typography>
                }
                confirmLabel="Confirm"
                confirmColor="primary"
                onConfirm={save}
            />
        </Paper>
    );
}
