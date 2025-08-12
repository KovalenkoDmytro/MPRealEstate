import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onClose: () => void;                 // closes the dialog (parent controls `open`)
    onConfirm: () => Promise<void> | void; // do the thing (can be async)
    confirmColor?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
};

export default function ConfirmDialog({
                                          open,
                                          title,
                                          description,
                                          confirmLabel = "OK",
                                          cancelLabel = "Cancel",
                                          onClose,
                                          onConfirm,
                                          confirmColor = "primary",
                                      }: ConfirmDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (submitting) return;
        try {
            setSubmitting(true);
            await onConfirm();
            onClose(); // close after success (or move to parent if you want finer control)
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
            <DialogTitle>{title}</DialogTitle>
            {description && (
                <DialogContent>
                    {typeof description === "string" ? (
                        <Typography variant="body2" color="text.secondary">{description}</Typography>
                    ) : (
                        description
                    )}
                </DialogContent>
            )}
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={submitting}>{cancelLabel}</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={confirmColor}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} /> : undefined}
                >
                    {submitting ? "Working…" : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
