import React, { useMemo } from 'react';
import {Box, Grid, Typography, ThemeProvider, Stack} from '@mui/material';
import {AccessTime, TodayRounded} from '@mui/icons-material';
import { appointmentTheme } from './theme';

import DailyActivityChart from './DailyActivityChart';
import { SellerStats } from "@/types/Appointments/sellerAppointmentsStat";
import StatCard from "@/components/common/StatCard";
import IconAppointments from "@/icons/IconAppointments";
import theme from "@/theme";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";
import IconConfirm from "@/icons/IconConfirm";

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
        <ThemeProvider theme={appointmentTheme}>
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
                        <IconAppointments/>
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
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_43_118)">
                                    <path d="M9.99999 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 9.99999C18.3333 5.39762 14.6024 1.66666 9.99999 1.66666C5.39762 1.66666 1.66666 5.39762 1.66666 9.99999C1.66666 14.6024 5.39762 18.3333 9.99999 18.3333Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 5V10L13.3333 11.6667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_43_118">
                                        <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>}
                            iconBgColor="#D07669"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            label="Completed"
                            value={completed || 0}
                            icon={<IconConfirm/>}
                            iconBgColor="#572A4D"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            label="Cancelled"
                            value={cancelled || 0}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_43_142)">
                                    <path d="M9.99996 18.3333C14.6023 18.3333 18.3333 14.6024 18.3333 9.99999C18.3333 5.39762 14.6023 1.66666 9.99996 1.66666C5.39759 1.66666 1.66663 5.39762 1.66663 9.99999C1.66663 14.6024 5.39759 18.3333 9.99996 18.3333Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12.5 7.5L7.5 12.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M7.5 7.5L12.5 12.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_43_142">
                                        <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>}
                            iconBgColor="#4A5565"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            label="Total (30 Days)"
                            value={totalvalueLast30Days || 0}
                            icon={<IconTrendingUpBig/>}
                            iconBgColor="#CB9A9F"
                        />
                    </Grid>
                </Grid>

                <DailyActivityChart data={chartData} />
            </Box>
        </ThemeProvider>
    );
}
