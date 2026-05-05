import React, { useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import { Card, CardContent, CardActions, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, addDays } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import DealStatusBanner from "@/components/deal/DealStatusBanner";
import { useNotification } from "@/context/NotificationContext";
import { useTheme } from "@mui/material/styles";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconCalendarToday from "@/icons/IconCalendarToday";

export default function ConditionDayForm({ deal }: { deal: Deal }) {
    const theme = useTheme();
    const [conditionDay, setConditionDay] = useState<Date | null>(
        deal.condition_day ? new Date(deal.condition_day) : null
    );
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { setRedirectNotification } = useNotification();

    const save = async () => {
        if (!conditionDay) return;
        const response = await DealService.setConditionDay(
            deal.id,
            conditionDay.toISOString().split("T")[0]
        );
        setRedirectNotification(response.message, response.status);
        window.location.reload();
    };

    return (
        <>
            <DealStatusBanner deal={deal} role="buyer" feature="conditionDay" />

            {!deal.condition_day && (
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
                            <IconContainer>
                                <IconCalendarToday />
                            </IconContainer>
                            <Typography variant="h6">Set Condition Day</Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Select the condition day for this deal. The date must be at least 5 days from today.
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Select Condition Day"
                                value={conditionDay}
                                onChange={(d) => setConditionDay(d)}
                                slotProps={{ textField: { fullWidth: true } }}
                                minDate={addDays(new Date(), 5)}
                            />
                        </LocalizationProvider>
                    </CardContent>

                    <CardActions sx={{ p: 0, mt: 2 }}>
                        <Button
                            text="Set Condition Day"
                            disabled={!conditionDay}
                            onClick={() => setConfirmOpen(true)}
                        />
                    </CardActions>
                </Card>
            )}

            {!deal.condition_day && (
                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    title="Set Condition Day?"
                    description={
                        <Typography variant="body2" color="text.secondary">
                            You're about to set the condition day to{" "}
                            <strong>{conditionDay ? format(conditionDay, "PPP") : "—"}</strong>.
                        </Typography>
                    }
                    confirmLabel="Set Day"
                    onConfirm={save}
                />
            )}
        </>
    );
}
