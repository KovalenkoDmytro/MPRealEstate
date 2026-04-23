import React, { useMemo, useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import {TextField,Typography, Paper } from "@mui/material";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/ConfirmDialog";
import {useNotification} from "@/context/NotificationContext";
import theme from "@/theme";

export default function SetDepositForm({ deal }: { deal: Deal }) {
    const [depositAmount, setDepositAmount] = useState<number | ''>('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const amountNumber = typeof depositAmount === "number" ? depositAmount : parseFloat(depositAmount || "0");
    const canSubmit = useMemo(() => !Number.isNaN(amountNumber) && amountNumber > 0, [amountNumber]);
    const {setRedirectNotification } = useNotification();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) {
            alert("Please enter a valid deposit amount greater than 0.");
            return;
        }
        setConfirmOpen(true);
    };

    const save = async () => {
        const response = await DealService.setDeposit(deal.id, Number(amountNumber.toFixed(2)));
        setRedirectNotification(response.message, response.status);
        window.location.reload();
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
                mb: 3,
                boxShadow: 0,
            }}
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
                slotProps={{htmlInput :{ step: "50", min: "0" }}}
                value={depositAmount}
                onChange={(e) => {
                    const v = e.target.value;
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

            <Button
                type="submit"
                version='secondary'
                disabled={!canSubmit}
                text={"Save Deposit"}
            />

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
