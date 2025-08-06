import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import { Deal } from "@/types";

interface TimelineItemData {
    label: string;
    timestamp: string;
    color: string;
    Icon: React.ElementType;
}

export default function DealTimeline({ deal }: { deal: Deal }) {
    const timeline: TimelineItemData[] = [];

    if (deal.security_deposit) {
        timeline.push({
            label: `Set Required Security Deposit: $${Number(
                deal.security_deposit
            ).toLocaleString()}`,
            timestamp: deal.security_deposit_timestamp!,
            color: "#1976d2", // Blue
            Icon: LockIcon,
        });
    }

    if (deal.is_security_deposit_made) {
        timeline.push({
            label: "Security Deposit sent by buyer",
            timestamp: deal.deposit_made_at!,
            color: "#2e7d32", // Green
            Icon: AttachMoneyIcon,
        });
    }

    if (deal.is_security_deposit_confirmed) {
        timeline.push({
            label: "Seller confirmed the security deposit",
            timestamp: deal.deposit_confirmed_at!,
            color: "#2e7d32",
            Icon: CheckCircleIcon,
        });
    }

    if (deal.condition_day) {
        timeline.push({
            label: "Buyer selected Condition Day",
            timestamp: deal.condition_day_at!,
            color: "#2e7d32",
            Icon: EventIcon,
        });
    }

    if (deal.is_condition_day_confirmed) {
        timeline.push({
            label: "Seller confirmed Condition Day",
            timestamp: deal.condition_day_confirmed_at!,
            color: "#2e7d32",
            Icon: CheckCircleIcon,
        });
    }

    if (deal.possession_day) {
        timeline.push({
            label: "Buyer selected Possession Day",
            timestamp: deal.possession_day_at!,
            color: "#2e7d32",
            Icon: HomeIcon,
        });
    }

    if (deal.is_possession_day_confirmed) {
        timeline.push({
            label: "Seller confirmed Possession Day",
            timestamp: deal.possession_day_confirmed_at!,
            color: "#2e7d32",
            Icon: CheckCircleIcon,
        });
    }

    // Sort by timestamp
    const sortedTimeline = [...timeline].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return (
        <Box mt={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Deal Timeline
            </Typography>

            <Box sx={{ position: "relative", pl: 3 }}>
                {/* Vertical line */}
                <Box
                    sx={{
                        position: "absolute",
                        left: 10,
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        bgcolor: "#e0e0e0",
                    }}
                />

                <Stack spacing={4}>
                    {sortedTimeline.map((item, idx) => (
                        <Box key={idx} sx={{ display: "flex", position: "relative" }}>
                            {/* Icon Dot */}
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    backgroundColor: item.color,
                                    position: "absolute",
                                    left: -8,
                                    top: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                }}
                            >
                                <item.Icon fontSize="small" />
                            </Box>

                            {/* Content */}
                            <Box sx={{ ml: 5 }}>
                                <Typography variant="body1" fontWeight={600}>
                                    {item.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(item.timestamp).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
