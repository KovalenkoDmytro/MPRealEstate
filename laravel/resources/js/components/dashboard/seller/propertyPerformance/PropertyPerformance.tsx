import {Box, Typography, Grid, Stack} from '@mui/material';
import { PerformanceStats } from "@/types/models";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";
import StatCard from "@/components/common/StatCard";
import SectionCard from "@/design/SectionCard";
import { statTones } from "@/design/statTones";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconEye from "@/icons/IconEye";
import IconUsers from "@/icons/IconUsers";
import IconHeart from "@/icons/IconHeart";
import IconContainer from "@/components/common/IconContainer";
import DailyActivityChart from "@/components/dashboard/seller/propertyPerformance/DailyActivityChart";

interface PropertyPerformanceProps {
    stats: PerformanceStats;
}

export default function PropertyPerformance({ stats }: PropertyPerformanceProps) {

    const chartData = stats.chart_data.last_7_days || [];

    return (
        <SectionCard>

            <Stack gap={1.5} mb={4}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <IconContainer bgColor={statTones.warm.iconBgColor} >
                        <IconTrendingUpBig/>
                    </IconContainer>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Property Performance
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    Analytics overview
                </Typography>
            </Stack>


            <Grid container spacing={3} mb={6} >

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total Views"
                        value={stats.views.total || 0}
                        icon={<IconEye/>}
                        {...statTones.warm}
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Unique Viewers"
                        value={stats.views.unique || 0}
                        icon={<IconUsers/>}
                        {...statTones.accent}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total Favorites"
                        value={stats.favorites.total || 0}
                        icon={<IconHeart/>}
                        {...statTones.primary}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Views Last 7 Days"
                        value={stats.views.last_7_days || 0}
                        icon={<IconCalendarToday/>}
                        iconBgColor={statTones.warm.iconBgColor}
                    />
                </Grid>
            </Grid>

            <DailyActivityChart data={chartData} />
        </SectionCard>
    );
}
