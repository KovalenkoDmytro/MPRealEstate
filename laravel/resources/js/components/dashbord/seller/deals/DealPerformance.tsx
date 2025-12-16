import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
    HandshakeRounded,
    CheckCircleRounded,
    CancelRounded,
    HourglassEmptyRounded
} from '@mui/icons-material';

import DealMetricCard from './DealMetricCard';
import { DealStats } from './types';

interface DealPerformanceProps {
    stats: DealStats;
}

export default function DealPerformance({ stats }: DealPerformanceProps) {
    return (
        <Box
            sx={{
                mb: 6,
                p: { xs: 3, md: 4 },
                backgroundColor: 'background.paper',
                borderRadius: 4,
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
            }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <Box sx={{ p: 1, bgcolor: '#EEF2FF', borderRadius: 2, color: '#3B82F6', display: 'flex' }}>
                    <HandshakeRounded fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Deal Activity
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DealMetricCard
                        title="Pending Deals"
                        value={stats.pending}
                        type="pending"
                        icon={<HourglassEmptyRounded />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DealMetricCard
                        title="Completed"
                        value={stats.completed}
                        type="completed"
                        icon={<CheckCircleRounded />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DealMetricCard
                        title="Broken"
                        value={stats.broken}
                        type="broken"
                        icon={<CancelRounded />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DealMetricCard
                        title="Total All Time"
                        value={stats.total}
                        type="total"
                        icon={<HandshakeRounded />}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
