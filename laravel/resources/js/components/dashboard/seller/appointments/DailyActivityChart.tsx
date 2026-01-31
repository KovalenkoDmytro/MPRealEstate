import React, { useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DailyStat } from "@/types/Appointments/sellerAppointmentsStat";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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
                borderColor: '#4F46E5',
                backgroundColor: '#4F46E5',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        };
    }, [data]);

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111827',
                padding: 12,
                cornerRadius: 8,
                usePointStyle: true
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF' },
                border: { display: false }
            },
            y: {
                position: 'left',
                grid: { color: '#E5E7EB' },
                ticks: {
                    display: true,
                    color: '#6B7280',
                    font: { size: 11 },
                    stepSize: 1,
                },
                border: { display: false },
                min: 0,
            }
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: 400 }}>
            <Box mb={3}>
                <Typography variant="body2" color="text.secondary">Appointments per day</Typography>
            </Box>

            <Box height={300}>
                <Line data={chartConfig} options={chartOptions} />
            </Box>
        </Paper>
    );
}
