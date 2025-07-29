import React, { useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";

// MUI imports
import { Box, Button, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function ConditionDayForm({ deal }: { deal: Deal }) {
    const [conditionDay, setConditionDay] = useState<Date | null>(
        deal.condition_day ? new Date(deal.condition_day) : null
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!conditionDay) return;

        try {
            await DealService.setConditionDay(deal.id, conditionDay.toISOString().split("T")[0]);
            alert("Condition day set successfully!");
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Failed to set condition day.");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} mt={4}>
            <Stack spacing={2} direction="row" alignItems="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Select Condition Day"
                        value={conditionDay}
                        onChange={(newValue) => setConditionDay(newValue)}
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
    );
}
