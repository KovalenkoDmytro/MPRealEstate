import { useState } from "react";
import { PropertyDetail } from "@/types";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import DealStatusBanner from "@/components/deal/DealStatusBanner";
import { DealService } from "@/services/dealService";
import ConfirmDialog from "@/components/ConfirmDialog";
import SetDepositForm from "@/components/deal/seller/SetDepositForm";
import { useNotification } from "@/context/NotificationContext";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconConfirm from "@/icons/IconConfirm";

export default function DepositActions({ deal }: { deal: PropertyDetail }) {
    const theme = useTheme();
    const { setRedirectNotification, showNotification } = useNotification();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [depositDateTime, setDepositDateTime] = useState<Date | null>(new Date());

    const handleConfirm = async () => {
        if (!depositDateTime) return;
        try {
            setSubmitting(true);
            const response = await DealService.confirmDeposit(deal.id, depositDateTime);
            setRedirectNotification(response.message, response.status);
            window.location.reload();
        } catch (e: unknown) {
            showNotification(e instanceof Error ? e.message : "Something went wrong.", "error");
        } finally {
            setSubmitting(false);
            setConfirmOpen(false);
        }
    };

    return (
        <>
            <DealStatusBanner deal={deal} role="seller" feature="deposit" />

            {!deal.security_deposit && <SetDepositForm deal={deal} />}

            {deal.is_security_deposit_made && !deal.is_security_deposit_confirmed && (
                <Card
                    variant="outlined"
                    sx={{
                        mt: 3,
                        p: theme.shape.padding,
                        backgroundColor: theme.palette.background.white,
                        borderRadius: theme.shape.borderRadius,
                        border: `1px solid ${theme.palette.border.main}`,
                    }}
                >
                    <CardContent sx={{ p: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <IconContainer>
                                <IconConfirm />
                            </IconContainer>
                            <Typography variant="h6">Confirm Security Deposit</Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            The buyer has marked the security deposit as made. Select the received date and confirm.
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Deposit received date & time"
                                value={depositDateTime}
                                onChange={(dt) => setDepositDateTime(dt)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </CardContent>

                    <CardActions sx={{ p: 0, mt: 2 }}>
                        <Button
                            text={submitting ? "Confirming..." : "Confirm Deposit"}
                            disabled={!depositDateTime || submitting}
                            onClick={() => setConfirmOpen(true)}
                        />
                    </CardActions>
                </Card>
            )}

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Confirm deposit received?"
                description={
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            This will mark the buyer's security deposit as <strong>confirmed</strong>.
                        </Typography>
                        <Typography variant="body2">
                            <strong>Received:</strong>{" "}
                            {depositDateTime ? format(depositDateTime, "PPpp") : "—"}
                        </Typography>
                    </Box>
                }
                confirmLabel="Confirm"
                onConfirm={handleConfirm}
            />
        </>
    );
}
