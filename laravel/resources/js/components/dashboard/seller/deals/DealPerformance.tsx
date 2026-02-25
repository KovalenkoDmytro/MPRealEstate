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
                        // icon={<VisibilityRounded/>}
                        // iconBgColor="#D07669"
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Completed"
                        value={stats.completed}
                        icon={<IconConfirm/>}
                        iconBgColor={theme.palette.primary.main}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Broken"
                        value={stats.broken}
                        icon={<IconClose/>}
                        iconBgColor="#4A5565"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total All Time"
                        value={stats.total}
                        // icon={<VisibilityRounded/>}
                        // iconBgColor="#D07669"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
