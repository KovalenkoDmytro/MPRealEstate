import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
    Handshake,       // For Total
    CheckCircle,     // For Completed
    Cancel,          // For Broken
    HourglassEmpty   // For Pending
} from '@mui/icons-material';

import DealMetricCard from './DealMetricCard';
import { DealStats } from './types';

interface DealPerformanceProps {
    stats: DealStats;
}

export default function DealPerformance({ stats }: DealPerformanceProps) {
    return (
        <Box sx={{ mb: 6 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Box sx={{ p: 1, bgcolor: '#F3F4F6', borderRadius: 2, color: '#374151', display: 'flex' }}>
                    <Handshake fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Deal Activity
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* 1. Pending (Active) - Often the most important to see first */}
                <Grid size={{xs:12, sm:6, md:3}}>
                    <DealMetricCard
                        title="Pending Deals"
                        value={stats.pending}
                        type="pending"
                        icon={<HourglassEmpty />}
                    />
                </Grid>

                {/* 2. Completed */}
                <Grid size={{xs:12, sm:6, md:3}}>
                    <DealMetricCard
                        title="Completed"
                        value={stats.completed}
                        type="completed"
                        icon={<CheckCircle />}
                    />
                </Grid>

                {/* 3. Broken */}
                <Grid size={{xs:12, sm:6, md:3}}>
                    <DealMetricCard
                        title="Broken"
                        value={stats.broken}
                        type="broken"
                        icon={<Cancel />}
                    />
                </Grid>

                {/* 4. Total All Time */}
                <Grid size={{xs:12, sm:6, md:3}}>
                    <DealMetricCard
                        title="Total All Time"
                        value={stats.total}
                        type="total"
                        icon={<Handshake />}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
