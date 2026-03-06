import React, { useMemo } from 'react';
import {Box, Grid, Typography, ThemeProvider, Stack} from '@mui/material';
import { appointmentTheme } from './theme';
import DailyActivityChart from './DailyActivityChart';
import { SellerStats } from "@/types/Appointments/sellerAppointmentsStat";
import StatCard from "@/components/common/StatCard";
import IconAppointments from "@/icons/IconAppointments";
import theme from "@/theme";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";
import IconConfirm from "@/icons/IconConfirm";
import IconClose from "@/icons/IconClose";
import IconClock from "@/icons/IconClock";
import IconContainer from "@/components/common/IconContainer";

interface AppointmentStatsProps {
    stats: SellerStats;
}

export default function AppointmentStats({ stats }: AppointmentStatsProps) {
    const { pending, completed, cancelled } = stats.summary.breakdown;
    const totalvalueLast30Days = stats.summary.total_last_30_days;
    const chartData = stats.chart_data.last_7_days || [];

    // Formats dates. Safe to keep inside useMemo.
    const dateRange = useMemo(() => {
        if (!chartData.length) return '';

        const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
        return `${fmt.format(new Date(chartData[0].date))} - ${fmt.format(new Date(chartData[chartData.length - 1].date))}`;
    }, [chartData]);


    return (

            <Box
                sx={{
                    p: theme.shape.padding,
                    backgroundColor: theme.palette.background.white,
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.border.main}`,
                }}
            >
                <Stack  gap={1.5} mb={4}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <IconContainer>
                            <IconAppointments/>
                        </IconContainer>
                        <Typography variant="h5" fontWeight={700} color="text.primary">
                            Appointments
                        </Typography>
                    </Box>

                    {dateRange && (
                        <Typography variant="body2" color="text.secondary">
                            Week: {dateRange}
                        </Typography>
                    )}
                </Stack>

                <Grid container spacing={3} mb={6} alignItems="stretch">
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            label="Pending"
                            value={pending || 0}
                            icon={<IconClock/>}
                            iconBgColor="#D07669"
                            background="linear-gradient(135deg, rgba(208, 118, 105, 0.10) 0%, rgba(208, 118, 105, 0.05) 100%)"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            label="Completed"
                            value={completed || 0}
                            icon={<IconConfirm/>}
                            iconBgColor="#572A4D"
                            background="linear-gradient(135deg, rgba(87, 42, 77, 0.10) 0%, rgba(87, 42, 77, 0.05) 100%)"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            label="Cancelled"
                            value={cancelled || 0}
                            icon={<IconClose/>}
                            iconBgColor="#4A5565"
                            background="linear-gradient(135deg, #F3F4F6 0%, #F9FAFB 100%)"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            label="Total (30 Days)"
                            value={totalvalueLast30Days || 0}
                            icon={<IconTrendingUpBig/>}
                            iconBgColor="#CB9A9F"
                            background="linear-gradient(135deg, rgba(203, 154, 159, 0.10) 0%, rgba(203, 154, 159, 0.05) 100%)"
                        />
                    </Grid>
                </Grid>

                <DailyActivityChart data={chartData} />
            </Box>
    );
}
