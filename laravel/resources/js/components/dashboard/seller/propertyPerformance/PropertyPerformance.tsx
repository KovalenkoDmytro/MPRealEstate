import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

import {
    VisibilityRounded,
    FavoriteRounded,
    PersonOutlineRounded,
    TodayRounded,
    DateRangeRounded,
    TrendingUpRounded
} from '@mui/icons-material';

import PerformanceMetricCard from './PerformanceMetricCard';
import { PerformanceStats } from "@/types/models";

interface PropertyPerformanceProps {
    stats: PerformanceStats;
}

export default function PropertyPerformance({ stats }: PropertyPerformanceProps) {
    return (
        <Box
            sx={{
                mb: 6,
                p: { xs: 3, md: 4 },
                backgroundColor: 'background.paper',
                borderRadius: 4,
                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <Box sx={{ p: 1, bgcolor: '#EEF2FF', borderRadius: 2, color: '#4F46E5', display: 'flex' }}>
                    <TrendingUpRounded fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Property Performance
                </Typography>
            </Box>

            <Grid container spacing={3}>


                <Grid size={{ xs: 12, md: 4 }}>
                    <PerformanceMetricCard
                        title="Total Views"
                        value={stats.views.total}
                        icon={<VisibilityRounded />}
                        color="blue"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <PerformanceMetricCard
                        title="Unique Viewers"
                        value={stats.views.unique}
                        icon={<PersonOutlineRounded />}
                        color="emerald"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <PerformanceMetricCard
                        title="Total Favorites"
                        value={stats.favorites.total}
                        icon={<FavoriteRounded />}
                        color="pink"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <PerformanceMetricCard
                        title="Views Today"
                        value={stats.views.today}
                        icon={<TodayRounded />}
                        color="orange"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <PerformanceMetricCard
                        title="Views Last 7 Days"
                        value={stats.views.last_7_days}
                        icon={<DateRangeRounded />}
                        color="indigo"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
