import React, { useMemo, useState } from "react";
import { Deal, User } from "@/types";
import { DealService } from "@/services/dealService";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function LawyerInvite({ deal, lawyer }: { deal: Deal; lawyer?: User }) {
    const [lawyerCode, setLawyerCode] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const user = useAuth();

    const roleKey =
        user?.role === "seller" ? "is_seller_lawyer" :
            user?.role === "buyer"  ? "is_buyer_lawyer"  : null;

    // If lawyer is already assigned, show details
    if (roleKey && lawyer?.[roleKey]) {
        return (
            <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2} bgcolor="#e8f5e9">
                <Typography variant="h6" fontWeight="bold" gutterBottom>📩 Your Lawyer</Typography>
                <Typography><strong>Name:</strong> {lawyer.name}</Typography>
                <Typography><strong>Email:</strong> {lawyer.email}</Typography>
                <Typography><strong>Lawyer Code:</strong> {lawyer.lawyer_number || "N/A"}</Typography>
            </Box>
        );
    }

    const code = lawyerCode.trim().toUpperCase();
    const isValid = useMemo(() => /^[A-Z0-9]{9}$/.test(code), [code]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setConfirmOpen(true);
    };

    const sendInvite = async () => {
        await DealService.inviteLawyer(deal.id, code);
        alert("Lawyer invited successfully!");
        window.location.reload();
    };

    return (
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                📩 Invite a Lawyer
            </Typography>

            <Box component="form" onSubmit={handleSubmit} mt={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        value={lawyerCode}
                        onChange={(e) => setLawyerCode(e.target.value)}
                        label="Lawyer Code"
                        placeholder="Enter 9-character code"
                        slotProps={{htmlInput :{ maxLength: 9, pattern: "[A-Za-z0-9]{9}" }}}
                        required
                        fullWidth
                        helperText="Letters & numbers only, 9 characters."
                        error={lawyerCode.length > 0 && !isValid}
                    />

                    <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                        Invite
                    </Button>
                </Stack>
            </Box>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Invite Lawyer?"
                description={
                    <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                            You’re about to invite a lawyer to this deal.
                        </Typography>
                        <Typography variant="body2"><strong>Deal:</strong> #{deal.id}</Typography>
                        <Typography variant="body2"><strong>Your side:</strong> {user?.role ?? "—"}</Typography>
                        <Typography variant="body2"><strong>Lawyer Code:</strong> {code}</Typography>
                    </Stack>
                }
                confirmLabel="Send Invite"
                confirmColor="primary"
                onConfirm={sendInvite}
            />
        </Box>
    );
}
