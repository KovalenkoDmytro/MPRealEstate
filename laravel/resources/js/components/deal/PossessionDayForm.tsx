import React, {useState} from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import { Box, Button, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {addDays, format} from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import DealStatusBanner from "@/components/deal/DealStatusBanner";
import {useNotification} from "@/context/NotificationContext";

export default function PossessionDayForm({ deal }: { deal: Deal }) {
    const [possessionDay, setPossessionDay] = useState<Date | null>(
        deal.possession_day ? new Date(deal.possession_day) : null
    );
    const [confirmOpen, setConfirmOpen] = useState(false);
    const {setRedirectNotification } = useNotification();
    const conditionDay = new Date(deal.condition_day!);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!possessionDay) return;
        setConfirmOpen(true);
    };

    const save = async () => {
        if (!possessionDay) return;
        const response =  await DealService.setPossessionDay(
            deal.id,
            possessionDay.toISOString().split("T")[0]
        );
        setRedirectNotification(response.message, response.status);
        window.location.reload();
    };



    return (
        <>
            <DealStatusBanner deal={deal} role="buyer" feature="possessionDay" />

            {!deal.possession_day &&
                <Box component="form" onSubmit={handleSubmit} mt={4}>
                <Stack spacing={2} direction="row" alignItems="center">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Possession Day"
                            value={possessionDay}
                            onChange={(d) => setPossessionDay(d)}
                            disabled={!!deal.possession_day}
                            slotProps={{ textField: { fullWidth: true } }}
                            minDate={addDays(conditionDay,1)}
                        />
                    </LocalizationProvider>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={!!deal.possession_day || !possessionDay}
                    >
                        Select
                    </Button>
                </Stack>
            </Box>
            }

            {!deal.possession_day &&
                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    title="Set Possession Day?"
                    description={
                        <Typography variant="body2" color="text.secondary">
                            You’re about to set the possession day to{" "}
                            <strong>{possessionDay ? format(possessionDay, "PPP") : "—"}</strong>.
                            This will update the deal for all parties.
                        </Typography>
                    }
                    confirmLabel="Set Day"
                    confirmColor="success"
                    onConfirm={save}
                />
            }
        </>
    );
}
