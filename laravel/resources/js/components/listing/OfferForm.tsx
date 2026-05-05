import React from "react";
import {
    Stack,
    Typography,
    TextField,
    InputAdornment,
    Button,
    CircularProgress,
} from "@mui/material";
import ConfirmDialog from "@/components/ConfirmDialog";

interface OfferFormProps {
    onSubmit: (data: { amount: string; message: string }) => void;
    onCancel?: () => void;
    processing: boolean;
    errors?: Record<string, string>;
}

export const OfferForm: React.FC<OfferFormProps> = ({onSubmit, onCancel, processing, errors = {},}) => {
    const [amount, setAmount] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const amountNumber = React.useMemo(
        () => (amount.trim() === "" ? NaN : Number(amount)),
        [amount]
    );

    const canSubmit = Number.isFinite(amountNumber) && amountNumber > 0 && message.trim().length > 0;

    const openConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit || processing) return;
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const normalized = Number(amountNumber.toFixed(2)).toString();
        onSubmit({ amount: normalized, message: message.trim() });
        setConfirmOpen(false); // Close confirm dialog after submitting
    };

    const handleAmountBlur = () => {
        if (!Number.isFinite(amountNumber)) return;
        setAmount(amountNumber.toFixed(2));
    };

    return (
        <Stack spacing={3} component="form" onSubmit={openConfirm}>


            {/* Inputs */}
            <Stack spacing={2}>
                <TextField
                    label="Offer Price"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={handleAmountBlur}
                    required
                    fullWidth
                    slotProps={{
                        htmlInput: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            inputProps: { min: 1, step: "0.01" },
                        },
                    }}
                    error={Boolean(errors.amount) || (!!amount && !Number.isFinite(amountNumber))}
                    helperText={errors.amount || (!!amount && !Number.isFinite(amountNumber) ? "Enter a valid amount." : " ")}
                />

                <TextField
                    label="Message to Seller"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    multiline
                    minRows={4}
                    required
                    fullWidth
                    error={Boolean(errors.message)}
                    helperText={errors.message || " "}
                />
            </Stack>

            {/* Actions: Both buttons are now here for consistent layout */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                {onCancel && (
                    <Button
                        onClick={onCancel}
                        variant="outlined"
                        color="inherit"
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!canSubmit || processing}
                    startIcon={processing ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    {processing ? "Sending..." : "Submit Offer"}
                </Button>
            </Stack>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Submit this offer?"
                description={
                    <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                            Please confirm your offer details before sending to the seller.
                        </Typography>
                        <Typography variant="body2">
                            <strong>Amount:</strong> ${Number.isFinite(amountNumber) ? amountNumber.toFixed(2) : "--"}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                            <strong>Message:</strong> {message.trim() || "—"}
                        </Typography>
                    </Stack>
                }
                confirmLabel="Send Offer"
                onConfirm={handleConfirm}
            />
        </Stack>
    );
};
