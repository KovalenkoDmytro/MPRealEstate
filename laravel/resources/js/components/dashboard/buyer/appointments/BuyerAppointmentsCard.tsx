import React from 'react';
import { Paper, Box, Typography, Stack, alpha } from '@mui/material';
import { EventRounded } from '@mui/icons-material';
import { format, isValid } from 'date-fns';
import { AppointmentsStats } from "@/types/models";

interface BuyerAppointmentsCardProps {
    data: AppointmentsStats;
}


export default function BuyerAppointmentsCard({ data }: BuyerAppointmentsCardProps) {
    const mainColor = '#F97316';
    const iconBgColor = alpha(mainColor, 0.15);

    let subtitleText = "No upcoming appointments";
    if (data.totalCount > 0 && data.nextAppointmentDate) {
        const nextDate = new Date(data.nextAppointmentDate);
        if (isValid(nextDate)) {
            subtitleText = `Next: ${format(nextDate, 'MMM d, h:mm a')}`;
        }
    }

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                bgcolor: '#fff',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '6px',
                    bgcolor: mainColor,
                }
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ fontSize: '1.1rem' }}>
                    Upcoming Appointments
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 3, // Rounded square shape
                        bgcolor: iconBgColor,
                        color: mainColor,
                    }}
                >
                    <EventRounded fontSize="medium" />
                </Box>
            </Stack>

            <Box>
                <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>
                    {data.totalCount}
                </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 500, mt: 'auto' }}>
                {subtitleText}
            </Typography>
        </Paper>
    );
}
