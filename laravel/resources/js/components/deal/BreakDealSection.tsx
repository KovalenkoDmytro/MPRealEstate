import React, { useState } from "react";
import { Deal, User } from "@/types";
import { DealService } from "@/services/dealService";

// MUI imports
import { TextField, Button, Box, Stack, Alert, Typography } from "@mui/material";

export default function BreakDealSection({ deal, authUser }: { deal: Deal; authUser: User }) {
    const [message, setMessage] = useState("");

    const handleBreakRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const action = event.currentTarget.dataset.action;
        const value = event.currentTarget.dataset.value;

        if (!confirm(`Are you sure you want to ${action === "request" ? "request to break" : value} this deal?`)) return;

        try {
            if (action === "request") {
                await DealService.breakDeal(deal.id, message);
            } else {
                const response = value === "accept" ? "approved" : "rejected";
                await DealService.respondToBreakRequest(deal.id, response as "approved" | "rejected");
            }

            alert("Action completed successfully.");
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Action failed.");
        }
    };

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
                        data-action="request"
                        onClick={handleBreakRequest}
                        disabled={!message.trim()}
                    >
                        Request to Break Deal
                    </Button>
                </Stack>
            )}

            {/* Waiting for Confirmation */}
            {authUser.id === deal.break_request?.initiator_id &&
                deal.break_request &&
                deal.break_request.status === "pending" && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        ⏳ Waiting for seller confirmation to break the deal.
                    </Alert>
                )}

            {/* Rejected by Seller */}
            {authUser.id === deal.break_request?.initiator_id &&
                deal.break_request &&
                deal.break_request.status === "rejected" && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Seller rejected your request to break the deal.
                    </Alert>
                )}

            {/* You Refused to Break */}
            {deal.break_request &&
                deal.break_request.status === "rejected" &&
                authUser.id !== deal.break_request.initiator_id && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        ⏳ You have refused to break the deal.
                    </Alert>
                )}

            {/* Respond to Break Request */}
            {authUser.id !== deal.break_request?.initiator_id &&
                deal.break_request &&
                deal.break_request.status === "pending" && (
                    <Box mt={2}>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            ⏳ Seller wants to break the deal. Please make a decision.
                        </Alert>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="error"
                                data-action="respond"
                                data-value="accept"
                                onClick={handleBreakRequest}
                            >
                                Accept
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                data-action="respond"
                                data-value="reject"
                                onClick={handleBreakRequest}
                            >
                                Reject
                            </Button>
                        </Stack>
                    </Box>
                )}
        </Box>
    );
}
