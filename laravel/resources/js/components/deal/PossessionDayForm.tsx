import React, { useState } from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";

// MUI imports
import { Box, Button, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function PossessionDayForm({ deal }: { deal: Deal }) {
    const [possessionDay, setPossessionDay] = useState<Date | null>(
        deal.possession_day ? new Date(deal.possession_day) : null
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!possessionDay) return;

        try {
            await DealService.setPossessionDay(deal.id, possessionDay.toISOString().split("T")[0]);
            alert("Possession day set successfully!");
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Failed to set possession day.");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} mt={4}>
            <Stack spacing={2} direction="row" alignItems="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Select Possession Day"
                        value={possessionDay}
                        onChange={(newValue) => setPossessionDay(newValue)}
                        disabled={!!deal.possession_day}
                        slotProps={{ textField: { fullWidth: true } }}
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
    );
}
