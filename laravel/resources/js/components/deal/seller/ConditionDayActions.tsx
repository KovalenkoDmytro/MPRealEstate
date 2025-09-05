import React, { useMemo, useState } from "react";
import { PropertyDetail } from "@/types";
import { DealService } from "@/services/dealService";
import { Card, CardContent, CardActions, Typography, Button, Stack } from "@mui/material";
import { format } from "date-fns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConfirmDialog from "@/components/ConfirmDialog";
import DealStatusBanner from "@/components/deal/DealStatusBanner";

export default function ConditionDayActions({ deal }: { deal: PropertyDetail }) {

    const [open, setOpen] = useState(false);
    const conditionDayStr: string = deal.condition_day as string;
    const conditionDate = useMemo(
        () => new Date(conditionDayStr),
        [conditionDayStr]
    );

    const doConfirm = async () => {
        // If your service returns {status:'success'}:
        const res = await DealService.confirmConditionDay(deal.id);
        if (res?.status !== "success") {
            throw new Error(res?.message || "Failed to confirm condition day.");
        }
        alert("Condition day confirmed.");
        window.location.reload();
    };

    return (
        <div>
            <DealStatusBanner deal={deal} role="seller" feature="conditionDay" />

            {!deal.is_condition_day_confirmed &&
            <Card variant="outlined" sx={{ mt: 3, bgcolor: "warning.50" as any }}>
                <CardContent>
                    <Stack spacing={0.5}>
                        <Typography variant="h6">📅 Confirm Condition Day</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Buyer selected <strong>{format(conditionDate, "PPP")}</strong> as the condition day.
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
                        Confirm Condition Day
                    </Button>
                </CardActions>

                <ConfirmDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    title="Confirm the buyer’s condition day?"
                    description={
                        <Typography variant="body2" color="text.secondary">
                            This will mark <strong>{format(conditionDate, "PPP")}</strong> as the official
                            condition day and notify all parties.
                        </Typography>
                    }
                    confirmLabel="Confirm"
                    confirmColor="success"
                    onConfirm={doConfirm}
                />
            </Card>
            }
        </div>
    );
}
