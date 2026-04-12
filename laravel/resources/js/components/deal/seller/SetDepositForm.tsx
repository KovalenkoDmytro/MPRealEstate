import React, { useMemo, useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import {
    Card, CardContent, CardActions,
    TextField, Typography, Stack,
} from "@mui/material";
import Button from "@/components/common/Button";
import { useTheme } from "@mui/material/styles";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useNotification } from "@/context/NotificationContext";
import IconContainer from "@/components/common/IconContainer";
import IconDollar from "@/icons/IconDollar";

export default function SetDepositForm({ deal }: { deal: Deal }) {
    const theme = useTheme();
    const [depositAmount, setDepositAmount] = useState<number | "">("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { setRedirectNotification } = useNotification();

    const amountNumber = typeof depositAmount === "number"
        ? depositAmount
        : parseFloat(depositAmount || "0");

    const canSubmit = useMemo(
        () => !Number.isNaN(amountNumber) && amountNumber > 0,
        [amountNumber],
    );

    const save = async () => {
        const response = await DealService.setDeposit(deal.id, Number(amountNumber.toFixed(2)));
        setRedirectNotification(response.message, response.status);
        window.location.reload();
    };

    return (
        <Card
            variant="outlined"
            sx={{
                mt: 3,
                p: theme.shape.padding,
                backgroundColor: theme.palette.background.white,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.border.main}`,
            }}
        >
            <CardContent sx={{ p: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <IconContainer>
                        <IconDollar/>
                    </IconContainer>
                    <Typography variant="h6">Set Security Deposit</Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Enter the required security deposit amount for this deal.
                </Typography>

                <TextField
                    type="number"
                    label="Deposit amount"
                    fullWidth
                    slotProps={{ htmlInput: { step: "0.01", min: "0" } }}
                    value={depositAmount}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v === "") return setDepositAmount("");
                        const n = parseFloat(v);
                        if (!Number.isNaN(n)) setDepositAmount(n);
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
            </CardContent>

            <CardActions sx={{ p: 0 }}>
                <Button
                    text="Set Deposit"
                    disabled={!canSubmit}
                    onClick={() => setConfirmOpen(true)}
                />
            </CardActions>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Set security deposit?"
                description={
                    <Typography variant="body2" color="text.secondary">
                        You're about to set the security deposit to{" "}
                        <strong>${amountNumber.toFixed(2)}</strong>. The buyer will be notified.
                    </Typography>
                }
                confirmLabel="Confirm"
                confirmColor="primary"
                onConfirm={save}
            />
        </Card>
    );
}
