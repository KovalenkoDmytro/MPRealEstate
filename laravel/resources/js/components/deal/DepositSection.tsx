import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { DealService } from "@/services/DealService";
import { Deal } from "@/types";

// MUI Imports
import { Box, Checkbox, FormControlLabel, Button, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function DepositSection({ deal }: { deal: Deal }) {
    const depositForm = useForm({ confirmed: false });
    const [depositDateTime, setDepositDateTime] = useState<Date | null>(null);

    const handleDepositSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!depositForm.data.confirmed || !depositDateTime) {
            alert("Please confirm deposit and select date/time.");
            return;
        }

        try {
            await DealService.markDepositMade(deal.id);

            // Optionally send depositDateTime to backend
            // await DealService.setDepositDateTime(deal.id, depositDateTime.toISOString());

            alert("Deposit confirmed successfully!");
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Error confirming deposit.");
        }
    };

    // Don't render if deposit isn't required or already made
    if (!deal.security_deposit || deal.is_made) return null;

    return (
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                💸 Security Deposit
            </Typography>

            <Box component="form" onSubmit={handleDepositSubmit} display="flex" flexDirection="column" gap={2}>
                {/* Checkbox */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={depositForm.data.confirmed}
                            onChange={(e) => depositForm.setData("confirmed", e.target.checked)}
                        />
                    }
                    label="I confirm I have made the security deposit."
                />

                {/* MUI DateTimePicker */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Deposit Date & Time"
                        value={depositDateTime}
                        onChange={(newValue) => setDepositDateTime(newValue)}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </LocalizationProvider>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={!depositForm.data.confirmed || !depositDateTime}
                >
                    Confirm Deposit
                </Button>
            </Box>
        </Box>
    );
}
