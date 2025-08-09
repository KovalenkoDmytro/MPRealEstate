import React, { useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import { TextField, Button, Box, Stack, Alert } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";

type Props = { deal: Deal };

export default function BreakDealSection({ deal }: Props) {
    const user = useAuth(); // assumes it returns { id: string | number, ... }
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleBreakTheDealRequest = async () => {
        try {
            setSubmitting(true);
            await DealService.breakTheDeal(deal.id, message.trim());
            alert("Action completed successfully.");
            window.location.reload();
        } catch (error: any) {
            alert(error?.message ?? "Action failed.");
        } finally {
            setSubmitting(false);
        }
    };

    // NOTE: align the payload/status strings with your backend: 'approved' | 'rejected'
    const handleRespondToBreakTheDeal = async (response: "approved" | "rejected") => {
        try {
            setSubmitting(true);
            await DealService.respondToBreakTheDeal(deal.id, response);
            alert("Action completed successfully.");
            window.location.reload();
        } catch (error: any) {
            alert(error?.message ?? "Action failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const isInitiator = user?.id === deal.break_request?.initiator_id;
    const status = deal.break_request?.status; // 'pending' | 'rejected' | 'approved' | undefined

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
                        disabled={!message.trim() || submitting}
                        onClick={handleBreakTheDealRequest}
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
                            onClick={() => handleRespondToBreakTheDeal("approved")}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            disabled={submitting}
                            onClick={() => handleRespondToBreakTheDeal("rejected")}
                        >
                            Reject
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
}
