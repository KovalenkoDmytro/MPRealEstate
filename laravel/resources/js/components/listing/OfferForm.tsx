import React from "react";
import {
    Box,
    Paper,
    Stack,
    Typography,
    TextField,
    InputAdornment,
    Button,
    CircularProgress,
} from "@mui/material";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ConfirmDialog from "@/components/ConfirmDialog";

interface OfferFormProps {
    onSubmit: (data: { amount: string; message: string }) => void;
    processing: boolean;
    errors: Record<string, string>;
}

export const OfferForm: React.FC<OfferFormProps> = ({
                                                        onSubmit,
                                                        processing,
                                                        errors = {},
                                                    }) => {
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
        // send as a string (2 decimals)
        const normalized = Number(amountNumber.toFixed(2)).toString();
        onSubmit({ amount: normalized, message: message.trim() });
    };

    const handleAmountBlur = () => {
        if (!Number.isFinite(amountNumber)) return;
        setAmount(amountNumber.toFixed(2));
    };

    return (
        <Paper
            component="form"
            onSubmit={openConfirm}
            elevation={0}
            sx={{
                mt: 3,
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
            }}
        >
            <Stack spacing={2}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                    <LocalOfferRoundedIcon color="primary" />
                    <Typography variant="h6">Make an Offer</Typography>
                </Stack>

                <TextField
                    label="Offer Price"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={handleAmountBlur}
                    required
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { min: 1, step: "0.01" },
                    }}
                    error={Boolean(errors.amount) || (!!amount && !Number.isFinite(amountNumber))}
                    helperText={
                        errors.amount
                            ? errors.amount
                            : !!amount && !Number.isFinite(amountNumber)
                                ? "Enter a valid amount."
                                : " "
                    }
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

                <Box>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!canSubmit || processing}
                        startIcon={processing ? <CircularProgress size={18} /> : undefined}
                    >
                        {processing ? "Sending…" : "Submit Offer"}
                    </Button>
                </Box>
            </Stack>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Submit this offer?"
                description={
                    <Stack spacing={0.75}>
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
                confirmColor="primary"
                onConfirm={handleConfirm}
            />
        </Paper>
    );
};
