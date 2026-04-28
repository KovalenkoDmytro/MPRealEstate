import React, { useMemo, useState } from "react";
import { DealService } from "@/services/dealService";
import { Deal } from "@/types";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    FormControlLabel,
    Stack,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { format } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import DealStatusBanner from "@/components/deal/DealStatusBanner";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconDollar from "@/icons/IconDollar";
import { useNotification } from "@/context/NotificationContext";

export default function DepositSection({ deal }: { deal: Deal }) {
    const theme = useTheme();
    const { showNotification, setRedirectNotification } = useNotification();

    const [confirmed, setConfirmed] = useState(false);
    const [depositDateTime, setDepositDateTime] = useState<Date | null>(new Date());
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    if (!deal.security_deposit) return null;

    const canSubmit = useMemo(
        () => confirmed && !!depositDateTime,
        [confirmed, depositDateTime],
    );

    const save = async () => {
        try {
            setSubmitting(true);
            await DealService.markDepositMade(deal.id, depositDateTime as Date);
            setRedirectNotification("Deposit confirmed successfully!", "success");
            window.location.reload();
        } catch (e: any) {
            showNotification(e?.message || "Failed to confirm deposit. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <DealStatusBanner deal={deal} role="buyer" feature="deposit" />

            {!deal.is_security_deposit_made && (
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
                                <IconDollar />
                            </IconContainer>
                            <Typography variant="h6">Security Deposit</Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Confirm the security deposit has been made and select the date and time it was received.
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={confirmed}
                                        onChange={(e) => setConfirmed(e.target.checked)}
                                    />
                                }
                                label="I confirm I have made the security deposit."
                            />

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Deposit received date & time"
                                    value={depositDateTime}
                                    onChange={(newValue) => setDepositDateTime(newValue)}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Box>
                    </CardContent>

                    <CardActions sx={{ p: 0, mt: 2 }}>
                        <Button
                            text={submitting ? "Saving..." : "Confirm Deposit"}
                            disabled={!canSubmit || submitting}
                            onClick={() => setConfirmOpen(true)}
                        />
                    </CardActions>
                </Card>
            )}

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Confirm Security Deposit?"
                description={
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            You're about to confirm the security deposit for this deal.
                        </Typography>
                        <Typography variant="body2">
                            <strong>Deposit date & time:</strong>{" "}
                            {depositDateTime ? format(depositDateTime, "PPpp") : "—"}
                        </Typography>
                    </Box>
                }
                confirmLabel="Confirm"
                onConfirm={save}
            />
        </>
    );
}
