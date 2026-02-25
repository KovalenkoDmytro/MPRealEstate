import React from 'react';
import {Box, Typography, Grid, Stack} from '@mui/material';
import {
    LocalOfferRounded,
    CheckCircleRounded,
    CancelRounded,
    PendingActionsRounded
} from '@mui/icons-material';

import OfferMetricCard from './OfferMetricCard';
import { OfferStats } from "@/types/models";
import theme from "@/theme";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";
import StatCard from "@/components/common/StatCard";
import IconDollar from "@/icons/IconDollar";
import IconConfirm from "@/icons/IconConfirm";
import IconClose from "@/icons/IconClose";

interface OfferPerformanceProps {
    stats: OfferStats;
}

export default function OfferPerformance({ stats }: OfferPerformanceProps) {
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
                    <IconDollar/>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Offer Activity
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    Response tracking
                </Typography>
            </Stack>


            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Pending Response"
                        value={stats.pending}
                        // icon={<VisibilityRounded/>}
                        // iconBgColor="#D07669"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Accepted"
                        value={stats.accepted}
                        icon={<IconConfirm/>}
                        iconBgColor={theme.palette.primary.main}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Rejected"
                        value={stats.rejected}
                        icon={<IconClose/>}
                        iconBgColor="#4A5565"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total Received"
                        value={stats.total}
                        // icon={<VisibilityRounded/>}
                        // iconBgColor="#D07669"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
