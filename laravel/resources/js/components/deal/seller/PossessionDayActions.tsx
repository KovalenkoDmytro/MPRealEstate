import { useMemo, useState } from "react";
import { PropertyDetail } from "@/types";
import { DealService } from "@/services/dealService";
import {
    Card,
    CardActions,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import DealStatusBanner from "@/components/deal/DealStatusBanner";
import { useNotification } from "@/context/NotificationContext";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconCalendarToday from "@/icons/IconCalendarToday";

export default function PossessionDayActions({ deal }: { deal: PropertyDetail }) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const possessionDate = useMemo(() => new Date(deal.possession_day as string), [deal.possession_day]);
    const { setRedirectNotification } = useNotification();

    const doConfirm = async () => {
        const response = await DealService.confirmPossessionDay(deal.id);
        setRedirectNotification(response.message, response.status);
        window.location.reload();
    };

    return (
        <>
            <DealStatusBanner deal={deal} role="seller" feature="possessionDay" />

            {!deal.is_possession_day_confirmed && (
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
                                <IconCalendarToday />
                            </IconContainer>
                            <Typography variant="h6">Confirm Possession Day</Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                            Buyer selected <strong>{format(possessionDate, "PPP")}</strong> as the possession day.
                        </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 0, mt: 2 }}>
                        <Button
                            text="Confirm Possession Day"
                            onClick={() => setOpen(true)}
                        />
                    </CardActions>
                </Card>
            )}

            <ConfirmDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Confirm the buyer's possession day?"
                description={
                    <Typography variant="body2" color="text.secondary">
                        This will mark <strong>{format(possessionDate, "PPP")}</strong> as the official
                        possession day and notify all parties.
                    </Typography>
                }
                confirmLabel="Confirm"
                onConfirm={doConfirm}
            />
        </>
    );
}
