import React from "react";
import { useForm } from "@inertiajs/react";
import { Deal, User } from "@/types";
import { DealService } from "@/services/dealService";

// MUI imports
import { Box, Typography, TextField, Button, Stack, Alert } from "@mui/material";

export default function LawyerInvite({ deal, lawyer }: { deal: Deal; lawyer?: User }) {
    const inviteForm = useForm({ lawyer_code: "" });

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await DealService.inviteLawyer(deal.id, inviteForm.data.lawyer_code);
            alert("Lawyer invited successfully!");
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Failed to invite lawyer.");
        }
    };


    // If lawyer already assigned
    if (lawyer?.is_buyer_lawyer || lawyer?.is_seller_lawyer) {
        return (
            <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2} bgcolor="#e8f5e9">
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    📩 Your Lawyer
                </Typography>
                <Typography>
                    <strong>Name:</strong> {lawyer.name}
                </Typography>
                <Typography>
                    <strong>Email:</strong> {lawyer.email}
                </Typography>
                <Typography>
                    <strong>Lawyer Code:</strong> {lawyer.lawyer_number || "N/A"}
                </Typography>
            </Box>
        );
    }

    // Invite form
    return (
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                📩 Invite a Lawyer
            </Typography>
            <Box component="form" onSubmit={handleInvite} mt={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        value={inviteForm.data.lawyer_code}
                        onChange={(e) => inviteForm.setData("lawyer_code", e.target.value)}
                        label="Lawyer Code"
                        placeholder="Enter 9-character code"
                        inputProps={{ maxLength: 9, pattern: "[A-Za-z0-9]{9}" }}
                        required
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Invite
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
