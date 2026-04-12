import { useMemo, useState } from "react";
import { Deal, User } from "@/types";
import { DealService } from "@/services/dealService";
import { Card, CardContent, CardActions, Typography, TextField, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "@/hooks/useAuth";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useNotification } from "@/context/NotificationContext";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconEnvelope from "@/icons/IconEnvelope";
import IconUser from "@/icons/IconUser";

export default function LawyerInvite({ deal, lawyer }: { deal: Deal; lawyer?: User }) {
    const theme = useTheme();
    const [lawyerCode, setLawyerCode] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const user = useAuth();
    const { setRedirectNotification } = useNotification();

    const roleKey =
        user?.role === "seller" ? "is_seller_lawyer" :
        user?.role === "buyer"  ? "is_buyer_lawyer"  : null;

    const code = lawyerCode.trim().toUpperCase();
    const isValid = useMemo(() => /^[A-Z0-9]{9}$/.test(code), [code]);

    const sendInvite = async () => {
        const response = await DealService.inviteLawyer(deal.id, code);
        setRedirectNotification(response.message, response.status);
        window.location.reload();
    };

    const cardSx = {
        mt: 3,
        p: theme.shape.padding,
        backgroundColor: theme.palette.background.white,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.border.main}`,
    };

    if (roleKey && lawyer?.[roleKey]) {
        return (
            <Card variant="outlined" sx={cardSx}>
                <CardContent sx={{ p: 0, mb:0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <IconContainer>
                            <IconUser />
                        </IconContainer>
                        <Typography variant="h6">Your Lawyer</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", m: 0, p: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Name:</strong> {lawyer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Email:</strong> {lawyer.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Code:</strong> {lawyer.lawyer_number ?? "N/A"}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="outlined" sx={cardSx}>
            <CardContent sx={{ p: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <IconContainer>
                        <IconEnvelope />
                    </IconContainer>
                    <Typography variant="h6">Invite a Lawyer</Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Enter your lawyer's 9-character code to add them to this deal.
                </Typography>

                <TextField
                    value={lawyerCode}
                    onChange={(e) => setLawyerCode(e.target.value)}
                    label="Lawyer Code"
                    placeholder="Enter 9-character code"
                    slotProps={{ htmlInput: { maxLength: 9, pattern: "[A-Za-z0-9]{9}" } }}
                    fullWidth
                    helperText={lawyerCode.length > 0 && !isValid ? "9 letters & numbers only." : " "}
                    error={lawyerCode.length > 0 && !isValid}
                />
            </CardContent>

            <CardActions sx={{ p: 0 }}>
                <Button
                    text="Send Invite"
                    icon={<IconEnvelope />}
                    disabled={!isValid}
                    onClick={() => setConfirmOpen(true)}
                />
            </CardActions>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Invite Lawyer?"
                description={
                    <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                            You're about to invite a lawyer to this deal.
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
        </Card>
    );
}
