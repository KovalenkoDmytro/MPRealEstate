import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import { Deal } from "@/types";
import { format } from "date-fns";

type DealTimelineItemProps = {
    label: string;
    timestamp: string;
    color: string;
    Icon: React.ElementType;
}

function TimelineItem({label, timestamp, color, Icon,}: DealTimelineItemProps ) {
    return (
        <Box sx={{ display: "flex", position: "relative" }}>
            {/* Icon Dot */}
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: color,
                    position: "absolute",
                    left: -8,
                    top: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                }}
            >
                <Icon fontSize="small" />
            </Box>

            {/* Content */}
            <Box sx={{ ml: 5 }}>
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
        <Box mt={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Deal Timeline
            </Typography>

            <Box sx={{ position: "relative", pl: 3 }}>
                <Stack spacing={4}>
                    {deal.security_deposit && deal.security_deposit_set_at && (
                        <TimelineItem
                            label={`Set Required Security Deposit: $${Number(deal.security_deposit).toLocaleString()}`}
                            timestamp={deal.security_deposit_set_at}
                            color="#1976d2"
                            Icon={LockIcon}
                        />
                    )}

                    {deal.is_security_deposit_made && deal.security_deposit_made_at && (
                        <TimelineItem
                            label="Security Deposit sent by buyer"
                            timestamp={deal.security_deposit_made_at}
                            color="#2e7d32"
                            Icon={AttachMoneyIcon}
                        />
                    )}

                    {deal.is_security_deposit_confirmed && deal.security_deposit_confirmed_at && (
                        <TimelineItem
                            label="Seller confirmed the security deposit"
                            timestamp={deal.security_deposit_confirmed_at}
                            color="#2e7d32"
                            Icon={CheckCircleIcon}
                        />
                    )}

                    {deal.condition_day && deal.condition_day_selected_at && (
                        <TimelineItem
                            label={`Buyer selected Condition Day: ${format(deal.condition_day, "MMMM do, yyyy")}`}
                            timestamp={deal.condition_day_selected_at}
                            color="#2e7d32"
                            Icon={EventIcon}
                        />
                    )}

                    {deal.is_condition_day_confirmed && deal.condition_day_confirmed_at && (
                        <TimelineItem
                            label="Seller confirmed Condition Day"
                            timestamp={deal.condition_day_confirmed_at}
                            color="#2e7d32"
                            Icon={CheckCircleIcon}
                        />
                    )}

                    {deal.possession_day && deal.possession_day_selected_at && (
                        <TimelineItem
                            label={`Buyer selected Possession Day: ${format(deal.possession_day, "MMMM do, yyyy")}`}
                            timestamp={deal.possession_day_selected_at}
                            color="#2e7d32"
                            Icon={HomeIcon}
                        />
                    )}

                    {deal.is_possession_day_confirmed && deal.possession_day_confirmed_at && (
                        <TimelineItem
                            label="Seller confirmed Possession Day"
                            timestamp={deal.possession_day_confirmed_at}
                            color="#2e7d32"
                            Icon={CheckCircleIcon}
                        />
                    )}
                </Stack>
            </Box>
        </Box>
    );
}
