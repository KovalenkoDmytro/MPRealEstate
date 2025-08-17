import React, {useMemo, useState} from "react";
import { Deal } from "@/types";
import { DealService } from "@/services/dealService";
import { Box, Button, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import {InfoBlock} from "@/components/InfoBlock";

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

    const banner = useMemo(() => {
        if (deal.condition_day !== null && !deal.is_condition_day_confirmed) {
            return {
                type: "warning" as const,
                title: "Under consideration",
                message: `Waiting for the seller to confirm the condition day for ${deal.condition_day}`,
            };
        }
        if (deal.condition_day !== null && deal.is_condition_day_confirmed) {
            return {
                type: "success" as const,
                title: "Confirmed",
                message:`The seller has confirmed the condition day for ${deal.condition_day} .`,
            };
        }
        return null;
    }, [deal.condition_day, deal.is_condition_day_confirmed]);

    return (
        <>
            {banner  && (
                <InfoBlock
                    type={banner.type}
                    title={banner.title}
                    message={banner.message}
                />
            )}

            {!deal.condition_day &&
                <Box component="form" onSubmit={handleSubmit} mt={4}>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Select Condition Day"
                                value={conditionDay}
                                onChange={(d) => setConditionDay(d)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>

                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                        >
                            Select
                        </Button>
                    </Stack>
                </Box>
            }


            {!deal.condition_day &&
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
            }

        </>
    );
}
