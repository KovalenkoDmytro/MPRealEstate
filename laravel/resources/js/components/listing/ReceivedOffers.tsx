import React from "react";
import { Offer } from "@/types";
import {Card, Typography, Chip, Stack, Button, Alert} from "@mui/material";

interface ReceivedOffersProps {
    offers: Offer[];
    onUpdateStatus: (offerId: number, status: "accepted" | "rejected") => void;
}

export const ReceivedOffers: React.FC<ReceivedOffersProps> = ({offers, onUpdateStatus}) => {
    if (offers.length === 0) {
        return <Alert severity="info">No offers yet.</Alert>;
    }

    return (
        <>
            {offers.map((offer) => (
                <Card key={offer.id} sx={{ mb: 2, p: 2 }} variant="outlined">
                    <Typography>
                        <strong>👤 Buyer:</strong> {offer.buyer?.name || "Unknown Buyer"}
                    </Typography>
                    <Typography>
                        <strong>📧 Email:</strong> {offer.buyer?.email || "No Email"}
                    </Typography>
                    <Typography>
                        <strong>💰 Offer Price:</strong> ${offer.amount.toLocaleString()}
                    </Typography>
                    <Typography>
                        <strong>📝 Message:</strong> {offer.message}
                    </Typography>
                    <Typography>
                        <strong>📌 Status:</strong>{" "}
                        <Chip
                            label={offer.status}
                            color={
                                offer.status === "accepted"
                                    ? "success"
                                    : offer.status === "rejected"
                                        ? "error"
                                        : "warning"
                            }
                            size="small"
                        />
                    </Typography>

                    {offer.status === "pending" && (
                        <Stack direction="row" spacing={1} mt={2}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => onUpdateStatus(offer.id, "accepted")}
                            >
                                ✅ Accept
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => onUpdateStatus(offer.id, "rejected")}
                            >
                                ❌ Reject
                            </Button>
                        </Stack>
                    )}
                </Card>
            ))}
        </>
    );
};
