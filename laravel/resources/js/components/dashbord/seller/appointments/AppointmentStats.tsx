import React, { useMemo } from 'react';
import { Box, Grid, Typography, ThemeProvider } from '@mui/material'; // Note: Grid2 is the new standard in MUI v6
import { AccessTime } from '@mui/icons-material';
import { appointmentTheme } from './theme';
import StatCard from './StatCard';
import DailyActivityChart from './DailyActivityChart';
import { SellerStats } from "@/types/sellerAppointmentsStat";

interface AppointmentStatsProps {
    stats: SellerStats;
}

export default function AppointmentStats({ stats }: AppointmentStatsProps) {
    const { pending, completed, cancelled } = stats.summary.breakdown;
    const totalCountLast30Days = stats.summary.total_last_30_days;
    const chartData = stats.chart_data.last_7_days || [];

    // Formats dates. Safe to keep inside useMemo.
    const dateRange = useMemo(() => {
        if (!chartData.length) return '';

        const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
        return `${fmt.format(new Date(chartData[0].date))} - ${fmt.format(new Date(chartData[chartData.length - 1].date))}`;
    }, [chartData]);


    return (
        <ThemeProvider theme={appointmentTheme}>
            <Box
                sx={{
                    mb: 6,
                    p: { xs: 3, md: 4 },
                    backgroundColor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
                }}

            >

                <Box mb={3}>
                    <Typography variant="h6" fontWeight={500} color="text.primary">
                        Appointments
                    </Typography>
                    {dateRange && (
                        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                            <AccessTime sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                Period: {dateRange}
                            </Typography>
                        </Box>
                    )}
                </Box>


                <Grid container spacing={3} mb={6} alignItems="stretch">
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Pending"
                            count={pending || 0}
                            type="pending"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Completed"
                            count={completed || 0}
                            type="completed"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Cancelled"
                            count={cancelled || 0}
                            type="cancelled"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="Total (30 Days)"
                            count={totalCountLast30Days || 0}
                            type="total"
                        />
                    </Grid>
                </Grid>

                <DailyActivityChart data={chartData} />
            </Box>
        </ThemeProvider>
    );
}
