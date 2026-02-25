import React, { useMemo } from 'react';
import { Box, Grid, Typography, ThemeProvider } from '@mui/material';
import {AccessTime, TodayRounded} from '@mui/icons-material';
import { appointmentTheme } from './theme';

import DailyActivityChart from './DailyActivityChart';
import { SellerStats } from "@/types/Appointments/sellerAppointmentsStat";
import StatCard from "@/components/common/StatCard";

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
                    mb: 6,
                    p: { xs: 3, md: 4 },
                    backgroundColor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
                }}

            >


                <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                    <Box sx={{ p: 1, bgcolor: '#EEF2FF', borderRadius: 2, color: '#4F46E5', display: 'flex' }}>
                        <TodayRounded fontSize="small" />
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
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
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none">
                                <path d="M18.1675 8.33332C18.548 10.2011 18.2768 12.1428 17.399 13.8348C16.5212 15.5268 15.0899 16.8667 13.3437 17.6311C11.5976 18.3955 9.64215 18.5381 7.80354 18.0353C5.96494 17.5325 4.35429 16.4145 3.24019 14.8678C2.12609 13.3212 1.5759 11.4394 1.68135 9.53615C1.7868 7.63294 2.54153 5.8234 3.81967 4.4093C5.09781 2.9952 6.82211 2.06202 8.70502 1.76537C10.5879 1.46872 12.5156 1.82654 14.1666 2.77916" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.5 9.16668L10 11.6667L18.3333 3.33334" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>}
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
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 20 20" fill="none">
                                <path d="M18.3333 5.83334L11.25 12.9167L7.08329 8.75001L1.66663 14.1667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M13.3334 5.83334H18.3334V10.8333" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>}
                            iconBgColor="#CB9A9F"
                        />
                    </Grid>
                </Grid>

                <DailyActivityChart data={chartData} />
            </Box>
        </ThemeProvider>
    );
}
