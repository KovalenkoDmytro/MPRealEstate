import React, { useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import { Box, Button, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ConditionDayForm({ deal }: { deal: Deal }) {
    const [conditionDay, setConditionDay] = useState<Date | null>(
        deal.condition_day ? new Date(deal.condition_day) : null
    );
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!conditionDay) return;
        setConfirmOpen(true);
    };

    const save = async () => {
        if (!conditionDay) return;
        await DealService.setConditionDay(
            deal.id,
            conditionDay.toISOString().split("T")[0]
        );
        alert("Condition day set successfully!");
        window.location.reload();
    };

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} mt={4}>
                <Stack spacing={2} direction="row" alignItems="center">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Condition Day"
                            value={conditionDay}
                            onChange={(d) => setConditionDay(d)}
                            disabled={!!deal.condition_day}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>

                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={!!deal.condition_day || !conditionDay}
                    >
                        Select
                    </Button>
                </Stack>
            </Box>

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
        </>
    );
}
