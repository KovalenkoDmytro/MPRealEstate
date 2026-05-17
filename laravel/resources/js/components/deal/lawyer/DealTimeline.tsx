import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import theme from "@/theme";
import IconContainer from "@/components/common/IconContainer";
import IconLock from "@/icons/IconLock";
import IconDollar from "@/icons/IconDollar";
import IconConfirm from "@/icons/IconConfirm";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconHome from "@/icons/IconHome";
import { Deal } from "@/types";
import { format } from "date-fns";

type TimelineItemProps = {
    label: string;
    timestamp: string;
    icon: React.ReactNode;
};

function TimelineItem({ label, timestamp, icon }: TimelineItemProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <IconContainer>
                {icon}
            </IconContainer>
            <Box>
                <Typography variant="body1" fontWeight={600}>
                    {label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {new Date(timestamp).toLocaleString()}
                </Typography>
            </Box>
        </Box>
    );
}

export default function DealTimeline({ deal }: { deal: Deal }) {
    return (
        <Paper
            elevation={0}
            sx={{
                mt: 3,
                p: theme.shape.padding,
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
            }}
        >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Deal Timeline
            </Typography>

            <Stack spacing={3}>
                {deal.security_deposit && deal.security_deposit_set_at && (
                    <TimelineItem
                        label={`Set Required Security Deposit: $${Number(deal.security_deposit).toLocaleString()}`}
                        timestamp={deal.security_deposit_set_at}
                        icon={<IconLock />}
                    />
                )}

                {deal.is_security_deposit_made && deal.security_deposit_made_at && (
                    <TimelineItem
                        label="Security Deposit sent by buyer"
                        timestamp={deal.security_deposit_made_at}
                        icon={<IconDollar />}
                    />
                )}

                {deal.is_security_deposit_confirmed && deal.security_deposit_confirmed_at && (
                    <TimelineItem
                        label="Seller confirmed the security deposit"
                        timestamp={deal.security_deposit_confirmed_at}
                        icon={<IconConfirm />}
                    />
                )}

                {deal.condition_day && deal.condition_day_selected_at && (
                    <TimelineItem
                        label={`Buyer selected Condition Day: ${format(deal.condition_day, "MMMM do, yyyy")}`}
                        timestamp={deal.condition_day_selected_at}
                        icon={<IconCalendarToday />}
                    />
                )}

                {deal.is_condition_day_confirmed && deal.condition_day_confirmed_at && (
                    <TimelineItem
                        label="Seller confirmed Condition Day"
                        timestamp={deal.condition_day_confirmed_at}
                        icon={<IconConfirm />}
                    />
                )}

                {deal.possession_day && deal.possession_day_selected_at && (
                    <TimelineItem
                        label={`Buyer selected Possession Day: ${format(deal.possession_day, "MMMM do, yyyy")}`}
                        timestamp={deal.possession_day_selected_at}
                        icon={<IconCalendarToday />}
                    />
                )}

                {deal.is_possession_day_confirmed && deal.possession_day_confirmed_at && (
                    <TimelineItem
                        label="Seller confirmed Possession Day"
                        timestamp={deal.possession_day_confirmed_at}
                        icon={<IconConfirm />}
                    />
                )}
            </Stack>
        </Paper>
    );
}
