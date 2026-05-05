import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    CircularProgress,
} from "@mui/material";
import Button from "@/components/common/Button";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onClose: () => void;                 // closes the dialog (parent controls `open`)
    onConfirm: () => Promise<void | boolean> | void | boolean; // return false to keep dialog open
};

export default function ConfirmDialog({
                                          open,
                                          title,
                                          description,
                                          confirmLabel = "OK",
                                          cancelLabel = "Cancel",
                                          onClose,
                                          onConfirm,
                                      }: ConfirmDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (submitting) return;
        try {
            setSubmitting(true);
            const shouldClose = await onConfirm();
            if (shouldClose !== false) {
                onClose(); // close after success (or move to parent if you want finer control)
            }
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
                <Button
                    version="outline"
                    text={cancelLabel}
                    onClick={onClose}
                    disabled={submitting}
                />
                <Button
                    version="primary"
                    text={submitting ? "Working…" : confirmLabel}
                    onClick={handleConfirm}
                    disabled={submitting}
                    icon={submitting ? <CircularProgress size={18} /> : undefined}
                />
            </DialogActions>
        </Dialog>
    );
}
