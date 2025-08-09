import React, { useState } from "react";
import { Deal } from "@/types";
import {DealService} from "@/services/dealService";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function SetDepositForm({ deal }: { deal: Deal }) {
    const [depositAmount, setDepositAmount] = useState<number>(0);

    // Only show if deposit is NOT set yet
    if (deal.security_deposit) {
        return (
            <p className="text-green-600 font-medium mt-4">
                Security deposit already set: ${deal.security_deposit}
            </p>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await DealService.setDeposit(deal.id, depositAmount)
            if (response.status !== 'success') throw new Error("Failed to set deposit");

            alert("Deposit saved successfully!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving the deposit.");
        }
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
                mt: 4,
                p: 4,
                borderRadius: 2,
                backgroundColor: "#f9fafb", // matches bg-gray-50
            }}
        >
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Set Security Deposit Amount
            </Typography>

            <TextField
                type="number"
                label="Enter deposit amount"
                fullWidth
                variant="outlined"
                required
                inputProps={{
                    step: "0.01",
                    min: "0",
                }}
                value={depositAmount || ""}
                onChange={(e) => {
                    const value = e.target.value;
                    setDepositAmount(value === "" ? 0 : parseFloat(value));
                }}
                onBlur={(e) => {
                    if (e.target.value) {
                        setDepositAmount(
                            parseFloat(parseFloat(e.target.value).toFixed(2))
                        );
                    }
                }}
            />

            <Box mt={2}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#1e40af" }, // hover:bg-blue-700
                    }}
                >
                    Save Deposit
                </Button>
            </Box>
        </Paper>
    );
}
