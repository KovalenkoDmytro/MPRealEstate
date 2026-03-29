import {Box, Typography, Grid, Stack} from '@mui/material';
import { PerformanceStats } from "@/types/models";
import theme from "@/theme";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";
import StatCard from "@/components/common/StatCard";
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
                    <IconContainer bgColor="#D07669" >
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
                        iconBgColor="#D07669"
                        background="linear-gradient(135deg, rgba(208, 118, 105, 0.10) 0%, rgba(208, 118, 105, 0.05) 100%)"
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Unique Viewers"
                        value={stats.views.unique || 0}
                        icon={<IconUsers/>}
                        iconBgColor="#CB9A9F"
                        background={"linear-gradient(90deg, rgba(203, 154, 159, 0.10) 0%, rgba(203, 154, 159, 0.05) 100%)"}

                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Total Favorites"
                        value={stats.favorites.total || 0}
                        icon={<IconHeart/>}
                        iconBgColor="#572A4D"
                        background="linear-gradient(135deg, rgba(87, 42, 77, 0.10) 0%, rgba(87, 42, 77, 0.05) 100%)"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        label="Views Last 7 Days"
                        value={stats.views.last_7_days || 0}
                        icon={<IconCalendarToday/>}
                        iconBgColor="#D07669"
                    />
                </Grid>
            </Grid>

            <DailyActivityChart data={chartData} />
        </Box>
    );
}
