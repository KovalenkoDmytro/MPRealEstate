import React, { useMemo, useState } from "react";
import { PropertyDetail } from "@/types";
import { DealService } from "@/services/dealService";

import { Card, CardContent, CardActions, Typography, Button, Stack } from "@mui/material";
import { format } from "date-fns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function PossessionDayActions({ deal }: { deal: PropertyDetail }) {
    // Only show if a possession day exists and isn't confirmed yet
    if (!deal.possession_day || deal.is_possession_day_confirmed) return null;

    const [open, setOpen] = useState(false);
    const possessionDayStr: string = deal.possession_day as string;
    const possessionDate = useMemo(
        () => new Date(possessionDayStr),
        [possessionDayStr]
    );

    const doConfirm = async () => {
        const res = await DealService.confirmPossessionDay(deal.id);

        // Adjust success check to your service shape
        if (res?.status === "success") {
            alert(res?.message || "Possession day confirmed.");
            window.location.reload();
            return;
        }
        // Fallback if it returns a fetch-like Response
        // if (!res.ok) {
        //   const data = await res.json().catch(() => ({}));
        //   throw new Error(data.message || `Failed with status ${res.status}`);
        // }

        if (res?.message) throw new Error(res.message);
        throw new Error("Failed to confirm possession day.");
    };

    return (
        <Card variant="outlined" sx={{ mt: 3, bgcolor: "warning.50" as any }}>
            <CardContent>
                <Stack spacing={0.5}>
                    <Typography variant="h6">📅 Confirm Possession Day</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Buyer selected <strong>{format(possessionDate, "PPP")}</strong> as the possession day.
                    </Typography>
                </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setOpen(true)}
                >
                    Confirm Possession Day
                </Button>
            </CardActions>

            <ConfirmDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Confirm the buyer’s possession day?"
                description={
                    <Typography variant="body2" color="text.secondary">
                        This will mark <strong>{format(possessionDate, "PPP")}</strong> as the official
                        possession day and notify all parties.
                    </Typography>
                }
                confirmLabel="Confirm"
                confirmColor="success"
                onConfirm={doConfirm}
            />
        </Card>
    );
}
