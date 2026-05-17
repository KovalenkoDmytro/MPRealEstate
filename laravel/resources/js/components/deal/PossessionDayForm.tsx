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

export default function PossessionDayForm({ deal }: { deal: Deal }) {
    const theme = useTheme();
    const [possessionDay, setPossessionDay] = useState<Date | null>(
        deal.possession_day ? new Date(deal.possession_day) : null
    );
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { setRedirectNotification } = useNotification();
    const conditionDay = new Date(deal.condition_day!);

    const save = async () => {
        if (!possessionDay) return;
        const response = await DealService.setPossessionDay(
            deal.id,
            possessionDay.toISOString().split("T")[0]
        );
        setRedirectNotification(response.message, response.status);
        window.location.reload();
    };

    return (
        <>
            <DealStatusBanner deal={deal} role="buyer" feature="possessionDay" />

            {!deal.possession_day && (
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
                            <Typography variant="h6">Set Possession Day</Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Select the possession day for this deal. The date must be after the condition day.
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Select Possession Day"
                                value={possessionDay}
                                onChange={(d) => setPossessionDay(d)}
                                slotProps={{ textField: { fullWidth: true } }}
                                minDate={addDays(conditionDay, 1)}
                            />
                        </LocalizationProvider>
                    </CardContent>

                    <CardActions sx={{ p: 0, mt: 2 }}>
                        <Button
                            text="Set Possession Day"
                            disabled={!possessionDay}
                            onClick={() => setConfirmOpen(true)}
                        />
                    </CardActions>
                </Card>
            )}

            {!deal.possession_day && (
                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    title="Set Possession Day?"
                    description={
                        <Typography variant="body2" color="text.secondary">
                            You're about to set the possession day to{" "}
                            <strong>{possessionDay ? format(possessionDay, "PPP") : "—"}</strong>.
                            This will update the deal for all parties.
                        </Typography>
                    }
                    confirmLabel="Set Day"
                    onConfirm={save}
                />
            )}
        </>
    );
}
