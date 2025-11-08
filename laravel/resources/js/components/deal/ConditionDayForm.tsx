import React, {useState} from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import { Box, Button, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, addDays } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import DealStatusBanner from "@/components/deal/DealStatusBanner";
import {useNotification} from "@/context/NotificationContext";

export default function ConditionDayForm({ deal }: { deal: Deal }) {
    const [conditionDay, setConditionDay] = useState<Date | null>(
        deal.condition_day ? new Date(deal.condition_day) : null
    );
    const [confirmOpen, setConfirmOpen] = useState(false);
    const {setRedirectNotification } = useNotification();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!conditionDay) return;
        setConfirmOpen(true);
    };

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

            {!deal.condition_day &&
                <Box component="form" onSubmit={handleSubmit} mt={4}>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Select Condition Day"
                                value={conditionDay}
                                onChange={(d) => setConditionDay(d)}
                                slotProps={{ textField: { fullWidth: true } }}
                                minDate={addDays(new Date(), 5)}
                            />
                        </LocalizationProvider>

                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                        >
                            Select
                        </Button>
                    </Stack>
                </Box>
            }


            {!deal.condition_day &&
                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    title="Set Condition Day?"
                    description={
                        <Typography variant="body2" color="text.secondary">
                            You’re about to set the condition day to{" "}
                            <strong>{conditionDay ? format(conditionDay, "PPP") : "—"}</strong>.
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
