import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
    Visibility,
    Favorite,
    PersonOutline,
    Today,
    DateRange,
    Insights
} from '@mui/icons-material';

import PerformanceMetricCard from './PerformanceMetricCard';
import { PerformanceStats } from './types';

interface PropertyPerformanceProps {
    stats: PerformanceStats;
}

export default function PropertyPerformance({ stats }: PropertyPerformanceProps) {
    return (
        <Box sx={{ mb: 6 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Box sx={{ p: 1, bgcolor: '#EEF2FF', borderRadius: 2, color: '#4F46E5', display: 'flex' }}>
                    <Insights fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Property Performance
                </Typography>
            </Box>

            <Grid container spacing={3}>

                {/* Total Views */}
                <Grid size={{xs:12, md:4}} >
                    <PerformanceMetricCard
                        title="Total Views"
                        value={stats.views.total}
                        icon={<Visibility />}
                        color="blue"
                    />
                </Grid>

                {/* Unique Viewers (Quality metric) */}
                <Grid size={{xs:12, md:4}}>
                    <PerformanceMetricCard
                        title="Unique Viewers"
                        value={stats.views.unique}
                        icon={<PersonOutline />}
                        color="emerald"
                    />
                </Grid>

                {/* Favorites (Conversion metric) */}
                <Grid size={{xs:12, md:4}}>
                    <PerformanceMetricCard
                        title="Total Favorites"
                        value={stats.favorites.total}
                        icon={<Favorite />}
                        color="pink"
                    />
                </Grid>



                {/* Views Today */}
                <Grid size={{xs:12, md:4}}>
                    <PerformanceMetricCard
                        title="Views Today"
                        value={stats.views.today}
                        icon={<Today />}
                        color="orange"
                    />
                </Grid>

                {/* Views Last 7 Days */}
                <Grid size={{xs:12, md:4}}>
                    <PerformanceMetricCard
                        title="Views Last 7 Days"
                        value={stats.views.last_7_days}
                        icon={<DateRange />}
                        color="indigo"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
