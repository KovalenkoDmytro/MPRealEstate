import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
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
import {Line} from 'react-chartjs-2';
import {DailyStat} from "@/types/Appointments/sellerAppointmentsStat";

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

export default function DailyActivityChart({data}: ChartProps) {

    const chartConfig = useMemo(() => {
        const formatLabel = (d: string) =>
            new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short'}).format(new Date(d));

        return {
            labels: data.map(d => formatLabel(d.date)),
            datasets: [{
                label: 'Appointments',
                data: data.map(d => d.total),
                borderColor: '#cb9a9f',
                backgroundColor: '#cb9a9f',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#cb9a9f',
                pointBorderColor: '#cb9a9f',
                pointHoverRadius: 8,
                z: 10,
                clip: false as const,
            }]
        };
    }, [data]);

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {display: false},
            tooltip: {
                backgroundColor: '#111827',
                padding: 12,
                cornerRadius: 8,
                usePointStyle: true,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: '#e5e7eb',
                    drawTicks: true,
                    tickLength: 6,
                    z: -1,
                },
                border: {
                    display: true,
                    color: '#9ca3af',
                    width: 1.5,
                    dash: [5, 5],
                    z: -1,
                },
                ticks: {
                    color: '#9ca3af',
                    font: {size: 11, weight: 500}
                }
            },
            y: {
                position: 'left',
                grid: {
                    display: true,
                    color: '#e5e7eb',
                    drawTicks: true,
                    tickLength: 6,
                    z: -1,
                },
                border: {
                    display: true,
                    color: '#9ca3af',
                    width: 1.5,
                    dash: [5, 5],
                    z: -1,
                },
                ticks: {
                    display: true,
                    color: '#9ca3af',
                    font: {size: 11, weight: 500},
                    maxTicksLimit: 5,
                },
                min: 0,
            }
        },

        layout: {
            padding: {
                top: 10,
                right: 10,
                left: 0,
                bottom: 0
            }
        }
    };

    return (
        <Paper elevation={0}
               sx={{
                   p: 4,
                   borderRadius: 4,
                   border: '1px solid',
                   borderColor: 'divider',
                   height: 400,
                   backgroundColor: '#F9FAFB'
               }}>

            <Box mb={3}>
                <Typography variant="body2"
                            color="text.secondary"
                            fontWeight={600}
                            textTransform="uppercase"
                            letterSpacing="0.05em">
                    Appointments per day
                </Typography>
            </Box>

            <Box height={300}>
                <Line data={chartConfig} options={chartOptions}/>
            </Box>
        </Paper>
    );
}
