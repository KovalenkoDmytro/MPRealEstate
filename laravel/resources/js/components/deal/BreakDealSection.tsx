import React, { useMemo, useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import { TextField, Button, Box, Stack, Alert, Typography } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = { deal: Deal };

export default function BreakDealSection({ deal }: Props) {
    const user = useAuth(); // assumes it returns { id: string | number, role?: string, ... }
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // single confirm state for all actions
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmKind, setConfirmKind] = useState<"request" | "approve" | "reject" | null>(null);

    const isInitiator = user?.id === deal.break_request?.initiator_id;
    const status = deal.break_request?.status; // 'pending' | 'rejected' | 'approved' | undefined

    const canRequest = useMemo(() => message.trim().length > 0, [message]);

    const openConfirm = (kind: "request" | "approve" | "reject") => {
        if (kind === "request" && !canRequest) return;
        setConfirmKind(kind);
        setConfirmOpen(true);
    };

    const onConfirm = async () => {
        if (!confirmKind) return;

        try {
            setSubmitting(true);

            if (confirmKind === "request") {
                await DealService.breakTheDeal(deal.id, message.trim());
            } else if (confirmKind === "approve") {
                await DealService.respondToBreakTheDeal(deal.id, "approved");
            } else if (confirmKind === "reject") {
                await DealService.respondToBreakTheDeal(deal.id, "rejected");
            }

            alert("Action completed successfully.");
            window.location.reload();
        } catch (error: any) {
            alert(error?.message ?? "Action failed.");
        } finally {
            setSubmitting(false);
            setConfirmOpen(false);
            setConfirmKind(null);
        }
    };

    const confirmTitle =
        confirmKind === "request"
            ? "Request to Break Deal?"
            : confirmKind === "approve"
                ? "Accept Break Request?"
                : confirmKind === "reject"
                    ? "Reject Break Request?"
                    : "";

    const confirmColor =
        confirmKind === "request" || confirmKind === "approve" ? "error" : "primary";

    const confirmDescription =
        confirmKind === "request" ? (
            <Stack spacing={0.75}>
                <Typography variant="body2" color="text.secondary">
                    You’re about to send a request to break this deal.
                </Typography>
                <Typography variant="body2">
                    <strong>Reason:</strong> {message.trim()}
                </Typography>
            </Stack>
        ) : confirmKind === "approve" ? (
            <Typography variant="body2" color="text.secondary">
                This will <strong>approve</strong> the other party’s request and end the deal workflow.
            </Typography>
        ) : confirmKind === "reject" ? (
            <Typography variant="body2" color="text.secondary">
                This will <strong>reject</strong> the other party’s request to break the deal.
            </Typography>
        ) : null;

    return (
        <Box mt={4}>
            {/* Request Break */}
            {!deal.break_request && (
                <Stack spacing={2}>
                    <TextField
                        name="break_deal_message"
                        label="Reason to break deal"
                        placeholder="Enter reason"
                        fullWidth
                        multiline
                        minRows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                    <Button
                        variant="contained"
                        color="error"
                        disabled={!canRequest || submitting}
                        onClick={() => openConfirm("request")}
                    >
                        {submitting ? "Submitting..." : "Request to Break Deal"}
                    </Button>
                </Stack>
            )}

            {/* Waiting for Confirmation */}
            {isInitiator && status === "pending" && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    ⏳ Waiting for seller confirmation to break the deal.
                </Alert>
            )}

            {/* Rejected by Seller */}
            {isInitiator && status === "rejected" && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    Seller rejected your request to break the deal.
                </Alert>
            )}

            {/* You Refused to Break */}
            {!isInitiator && status === "rejected" && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    ⏳ You have refused to break the deal.
                </Alert>
            )}

            {/* Respond to Break Request */}
            {!isInitiator && status === "pending" && (
                <Box mt={2}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        ⏳ The other party wants to break the deal. Please make a decision.
                    </Alert>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="error"
                            disabled={submitting}
                            onClick={() => openConfirm("approve")}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            disabled={submitting}
                            onClick={() => openConfirm("reject")}
                        >
                            Reject
                        </Button>
                    </Stack>
                </Box>
            )}

            {/* Confirmation Dialog (universal) */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title={confirmTitle}
                description={confirmDescription}
                confirmLabel={
                    confirmKind === "request" ? "Send Request" :
                        confirmKind === "approve" ? "Accept" :
                            confirmKind === "reject" ? "Reject" : "OK"
                }
                confirmColor={confirmColor as any}
                onConfirm={onConfirm}
            />
        </Box>
    );
}
