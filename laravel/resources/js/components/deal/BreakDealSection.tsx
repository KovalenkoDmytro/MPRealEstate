import { useMemo, useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import {
    Card, CardContent, CardActions,
    TextField, Stack, Alert, Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/context/NotificationContext";
import ConfirmDialog from "@/components/ConfirmDialog";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconCanceled from "@/icons/IconCanceled";

type Props = { deal: Deal };

export default function BreakDealSection({ deal }: Props) {
    const theme = useTheme();
    const user = useAuth();
    const { showNotification } = useNotification();

    const [message, setMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmKind, setConfirmKind] = useState<"request" | "approve" | "reject" | null>(null);

    const isInitiator = user?.id === deal.break_request?.initiator_id;
    const status = deal.break_request?.status;
    const canRequest = useMemo(() => message.trim().length > 0, [message]);

    const openConfirm = (kind: "request" | "approve" | "reject") => {
        if (kind === "request" && !canRequest) return;
        setConfirmKind(kind);
        setConfirmOpen(true);
    };

    const onConfirm = async () => {
        if (!confirmKind) return false;

        if ((confirmKind === "approve" || confirmKind === "reject") && responseMessage.trim().length === 0) {
            showNotification("Please provide your response message.", "error");
            return false;
        }

        try {
            setSubmitting(true);
            if (confirmKind === "request") {
                await DealService.breakTheDeal(deal.id, message.trim());
            } else if (confirmKind === "approve") {
                await DealService.respondToBreakTheDeal(deal.id, "approved", responseMessage.trim());
            } else if (confirmKind === "reject") {
                await DealService.respondToBreakTheDeal(deal.id, "rejected", responseMessage.trim());
            }
            showNotification("Action completed successfully.", "success");
            setConfirmKind(null);
            setResponseMessage("");
            window.location.reload();
            return true;
        } catch (error: any) {
            showNotification(error?.message ?? "Action failed.", "error");
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    const confirmTitle =
        confirmKind === "request" ? "Request to Break Deal?" :
        confirmKind === "approve" ? "Accept Break Request?" :
        confirmKind === "reject"  ? "Reject Break Request?" : "";

    const confirmDescription =
        confirmKind === "request" ? (
            <Stack spacing={0.75}>
                <Typography variant="body2" color="text.secondary">
                    You're about to send a request to break this deal.
                </Typography>
                <Typography variant="body2">
                    <strong>Reason:</strong> {message.trim()}
                </Typography>
            </Stack>
        ) : confirmKind === "approve" ? (
            <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                    This will <strong>approve</strong> the other party's request and end the deal workflow.
                </Typography>
                <TextField
                    name="break_deal_response_message_approve"
                    label="Your response message"
                    placeholder="Write your response"
                    fullWidth
                    multiline
                    minRows={3}
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                />
            </Stack>
        ) : confirmKind === "reject" ? (
            <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                    This will <strong>reject</strong> the other party's request to break the deal.
                </Typography>
                <TextField
                    name="break_deal_response_message_reject"
                    label="Your response message"
                    placeholder="Write your response"
                    fullWidth
                    multiline
                    minRows={3}
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                />
            </Stack>
        ) : null;

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
                    <IconContainer bgColor={theme.palette.error.main}>
                        <IconCanceled />
                    </IconContainer>
                    <Typography variant="h6">Break Deal</Typography>
                </Stack>

                {/* Request form */}
                {!deal.break_request && (
                    <TextField
                        name="break_deal_message"
                        label="Reason to break deal"
                        placeholder="Enter reason"
                        fullWidth
                        multiline
                        minRows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                )}

                {/* Status alerts */}
                {isInitiator && status === "pending" && (
                    <Alert severity="warning">
                        Waiting for the other party to confirm the break request.
                    </Alert>
                )}

                {isInitiator && status === "rejected" && (
                    <Alert severity="error">
                        The other party rejected your request to break the deal.
                    </Alert>
                )}

                {!isInitiator && status === "rejected" && (
                    <Alert severity="info">
                        You have refused to break the deal.
                    </Alert>
                )}

                {!isInitiator && status === "pending" && (
                    <Alert severity="warning">
                        The other party wants to break the deal. Please make a decision below.
                    </Alert>
                )}
            </CardContent>

            {/* Actions */}
            {(!deal.break_request || (!isInitiator && status === "pending")) && (
                <CardActions sx={{ p: 0, mt: 2, gap: 1 }}>
                    {!deal.break_request && (
                        <Button
                            text={submitting ? "Submitting..." : "Request to Break Deal"}
                            disabled={!canRequest || submitting}
                            onClick={() => openConfirm("request")}
                        />
                    )}

                    {!isInitiator && status === "pending" && (
                        <>
                            <Button
                                text={submitting ? "Submitting..." : "Accept"}
                                disabled={submitting}
                                onClick={() => openConfirm("approve")}
                            />
                            <Button
                                text="Reject"
                                version="outline"
                                disabled={submitting}
                                onClick={() => openConfirm("reject")}
                            />
                        </>
                    )}
                </CardActions>
            )}

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => {
                    setConfirmOpen(false);
                    setConfirmKind(null);
                    setResponseMessage("");
                }}
                title={confirmTitle}
                description={confirmDescription}
                confirmLabel={
                    confirmKind === "request" ? "Send Request" :
                    confirmKind === "approve" ? "Accept" :
                    confirmKind === "reject"  ? "Reject" : "OK"
                }
                confirmColor={confirmKind === "reject" ? "primary" : "error"}
                onConfirm={onConfirm}
            />
        </Card>
    );
}
