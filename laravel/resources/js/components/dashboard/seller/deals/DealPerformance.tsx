import React from 'react';
import {Box, Typography, Grid, Stack} from '@mui/material';
import {
    HandshakeRounded,
    CheckCircleRounded,
    CancelRounded,
    HourglassEmptyRounded
} from '@mui/icons-material';

import DealMetricCard from './DealMetricCard';
import { DealStats } from "@/types/models";
import theme from "@/theme";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";
import IconArrangement from "@/icons/IconArrangement";
import StatCard from "@/components/common/StatCard";
import IconConfirm from "@/icons/IconConfirm";
import IconClose from "@/icons/IconClose";
import IconClock from "@/icons/IconClock";
import IconHandShake from "@/icons/IconHandShake";

interface DealPerformanceProps {
    stats: DealStats;
}

export default function DealPerformance({ stats }: DealPerformanceProps) {
    return (
        <Box
            sx={{
                p: theme.shape.padding,
                backgroundColor: theme.palette.background.white,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.border.main}`,
            }}
        >
            <Stack gap={1.5} mb={4}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <IconArrangement/>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Deal Activity
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    Current status
                </Typography>
            </Stack>


            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Pending Deals"
                        value={stats.pending}
                        icon={<IconClock/>}
                        iconBgColor="#D07669"
                        background="linear-gradient(90deg, rgba(208, 118, 105, 0.10) 0%, rgba(208, 118, 105, 0.05) 100%)"
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Completed"
                        value={stats.completed}
                        icon={<IconConfirm/>}
                        iconBgColor={theme.palette.primary.main}
                        background="linear-gradient(135deg, rgba(87, 42, 77, 0.10) 0%, rgba(87, 42, 77, 0.05) 100%)"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Broken"
                        value={stats.broken}
                        icon={<IconClose/>}
                        iconBgColor="#4A5565"
                        background="linear-gradient(135deg, #F3F4F6 0%, #F9FAFB 100%)"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total All Time"
                        value={stats.total}
                        background={"linear-gradient(90deg, rgba(203, 154, 159, 0.10) 0%, rgba(203, 154, 159, 0.05) 100%)"}
                        icon={<IconHandShake/>}
                        iconBgColor="#CB9A9F"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
