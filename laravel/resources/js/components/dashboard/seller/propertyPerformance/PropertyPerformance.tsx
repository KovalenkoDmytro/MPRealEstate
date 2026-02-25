import React from 'react';
import {Box, Typography, Grid, Stack} from '@mui/material';
import { PerformanceStats } from "@/types/models";
import theme from "@/theme";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";
import StatCard from "@/components/common/StatCard";

interface PropertyPerformanceProps {
    stats: PerformanceStats;
}

export default function PropertyPerformance({ stats }: PropertyPerformanceProps) {
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
                    <IconTrendingUpBig/>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Property Performance
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    Analytics overview
                </Typography>
            </Stack>


            <Grid container spacing={3}>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total Views"
                        value={stats.views.total || 0}
                        // icon={<VisibilityRounded/>}
                        // iconBgColor="#D07669"
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Unique Viewers"
                        value={stats.views.unique || 0}

                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total Favorites"
                        value={stats.favorites.total || 0}

                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Views Last 7 Days"
                        value={stats.views.last_7_days || 0}

                    />
                </Grid>

            </Grid>
        </Box>
    );
}
