import { useMemo } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { InsightsRounded } from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, type ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import type { DailyStat } from '@/types/Appointments/sellerAppointmentsStat';
import { neutral, primary, radius } from '@/design/tokens';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type ActivityChartProps = { data: DailyStat[]; title: string; metric: string; emptyMessage: string };

export default function ActivityChart({ data, title, metric, emptyMessage }: ActivityChartProps) {
    const total = data.reduce((sum, day) => sum + day.total, 0);
    const chartData = useMemo(() => ({
        labels: data.map((day) => format(parseISO(day.date), 'd MMM')),
        datasets: [{ label: metric, data: data.map((day) => day.total), borderColor: primary[600], backgroundColor: 'rgba(59,91,219,0.08)', fill: true, borderWidth: 2.5, tension: 0.3, pointRadius: 4, pointBackgroundColor: primary[600], pointBorderColor: neutral[0], pointBorderWidth: 2, pointHoverRadius: 6 }],
    }), [data, metric]);
    const options: ChartOptions<'line'> = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: neutral[900], padding: 12, cornerRadius: 10, displayColors: false } },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: neutral[500], font: { size: 11 }, maxRotation: 0 } },
            y: { beginAtZero: true, border: { display: false }, grid: { color: neutral[200], drawTicks: false }, ticks: { precision: 0, maxTicksLimit: 5, color: neutral[500], padding: 10, font: { size: 11 } } },
        },
        layout: { padding: { top: 8, right: 8 } },
    };

    return (
        <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, mt: 2, bgcolor: neutral[50], border: `1px solid ${neutral[200]}`, borderRadius: radius.lg }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
                <Box><Typography component="h3" fontWeight={700}>{title}</Typography><Typography variant="caption" color="text.secondary">Last 7 days</Typography></Box>
                <Box sx={{ textAlign: 'right' }}><Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: primary[900], lineHeight: 1.2 }}>{total.toLocaleString()}</Typography><Typography variant="caption" color="text.secondary">{metric.toLowerCase()}</Typography></Box>
            </Stack>
            {total > 0 ? <Box sx={{ height: { xs: 200, sm: 240 } }}><Line data={chartData} options={options} /></Box> : (
                <Stack alignItems="center" justifyContent="center" spacing={1.25} sx={{ minHeight: 200, bgcolor: neutral[100], borderRadius: radius.md, textAlign: 'center', px: 2 }}>
                    <Box sx={{ display: 'flex', p: 1.25, bgcolor: primary[50], color: primary[500], borderRadius: radius.md }}><InsightsRounded sx={{ fontSize: 28 }} /></Box>
                    <Typography fontWeight={600} sx={{ color: neutral[700] }}>No activity this week</Typography>
                    <Typography variant="body2" sx={{ color: neutral[600], maxWidth: 440 }}>{emptyMessage}</Typography>
                </Stack>
            )}
        </Paper>
    );
}
