import { Deal } from "@/types";
import { Alert, AlertTitle, Paper, Stack, Typography } from "@mui/material";
import theme from "@/theme";
import BlockIcon from "@mui/icons-material/Block";
import { format, isValid as isValidDate, parseISO } from "date-fns";

function formatBrokenAt(value: string | null): string | null {
    if (!value) return null;
    const parsed = parseISO(value);
    if (!isValidDate(parsed)) return null;
    return format(parsed, "PPP p");
}

export default function DealInactiveNotice({ deal }: { deal: Deal }) {
    const brokenAt = formatBrokenAt(deal.broken_at);

    return (
        <Paper
            elevation={0}
            sx={{
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
                mb: 3,
            }}
        >
            <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <BlockIcon sx={{ color: theme.palette.error.main }} />
                    <Typography variant="h5" fontWeight={700}>
                        This deal is no longer active
                    </Typography>
                </Stack>

                <Typography variant="body1" color="text.secondary">
                    This deal has been closed after a break request was approved
                </Typography>

                <Alert severity="warning" sx={{ borderRadius: "12px" }}>
                    <AlertTitle sx={{ fontWeight: 700 }}>{brokenAt ? ` Closed on ${brokenAt}.` : ""}</AlertTitle>
                </Alert>
            </Stack>
        </Paper>
    );
}
