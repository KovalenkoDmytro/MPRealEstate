import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {DailyStat} from "@/types/sellerAppointmentsStat";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
    data: DailyStat[];
}

export default function DailyActivityChart({ data }: ChartProps) {
    const chartConfig = useMemo(() => {
        const formatLabel = (d: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(new Date(d));

        return {
            labels: data.map(d => formatLabel(d.date)),
            datasets: [{
                label: 'Appointments',
                data: data.map(d => d.total),
                backgroundColor: '#4F46E5', hoverBackgroundColor: '#4338CA',
                borderRadius: 6, barPercentage: 0.6, maxBarThickness: 40,
            }]
        };
    }, [data]);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111827', padding: 12, cornerRadius: 8 } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9CA3AF' }, border: { display: false } },
            y: { position: 'right' as const, grid: { color: '#F3F4F6', borderDash: [5, 5] }, ticks: { display: false }, border: { display: false } }
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: 400 }}>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Daily Activity</Typography>
                    <Typography variant="body2" color="text.secondary">Appointments per day</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} sx={{ bgcolor: '#F3F4F6', px: 1.5, py: 0.5, borderRadius: 2 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#4F46E5', borderRadius: '50%' }} />
                    <Typography variant="caption" fontWeight={600} color="text.secondary">Appointments</Typography>
                </Box>
            </Box>
            <Box height={300}>
                <Bar data={chartConfig} options={chartOptions} />
            </Box>
        </Paper>
    );
}
