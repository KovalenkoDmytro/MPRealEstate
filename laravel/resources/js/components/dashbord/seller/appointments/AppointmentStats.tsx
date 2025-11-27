import React, { useMemo } from 'react';
import { Box, Grid, Typography, ThemeProvider } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { appointmentTheme } from './theme';
import StatCard from './StatCard';
import DailyActivityChart from './DailyActivityChart';
import { SellerStats } from "@/types/sellerAppointmentsStat";

interface AppointmentStatsProps {
    stats: SellerStats;
}

export default function AppointmentStats({ stats }: AppointmentStatsProps) {
    // 1. Data Prep
    const { pending, completed, cancelled } = stats.summary.breakdown;
    const totalCount = stats.summary.total_last_30_days;
    const chartData = stats.chart_data.last_7_days || [];

    // 2. Date Range Logic
    const dateRange = useMemo(() => {
        if (!chartData.length) return '';
        const fmt = (d: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(d));
        return `${fmt(chartData[0].date)} - ${fmt(chartData[chartData.length - 1].date)}`;
    }, [chartData]);

    return (
        <ThemeProvider theme={appointmentTheme}>
            <Box sx={{ mb: 6 }}>
                {/* Header - Now simplified without the Pill */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h5" color="text.primary">Appointments</Typography>
                        {dateRange && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime fontSize="inherit" /> Period: {dateRange}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Cards Grid - Updated to 4 columns */}
                <Grid container spacing={3} mb={4}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard title="Pending" count={pending || 0} type="pending" />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard title="Completed" count={completed || 0} type="completed" />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard title="Cancelled" count={cancelled || 0} type="cancelled" />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard title="Total (30 Days)" count={totalCount || 0} type="total" />
                    </Grid>
                </Grid>

                {/* Chart */}
                <DailyActivityChart data={chartData} />
            </Box>
        </ThemeProvider>
    );
}
