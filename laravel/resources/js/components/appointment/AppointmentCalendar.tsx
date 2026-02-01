import React, { useMemo } from 'react';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Paper, Box, Typography, styled, alpha, Divider, useTheme } from '@mui/material';
import { Appointment } from '@/types';



// 1. The Day Tile
const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'hasAppointments' && prop !== 'isTodayCustom',
})<{ hasAppointments?: boolean; isTodayCustom?: boolean }>(({ theme, hasAppointments, isTodayCustom, selected }) => {

    const rosyPink = (theme.palette.text as any).rosyPink || '#CB9A9F';
    const maroon = theme.palette.primary.main;
    const charcoal = theme.palette.text.primary;
    const white = theme.palette.common.white;

    // 1. CASE: Today (With or Without Appointment)
    if (isTodayCustom) {
        return {
            border: `1px solid ${maroon} !important`,
            color: `${maroon} !important`,
            fontWeight: 'bold',
            backgroundColor: hasAppointments
                ? `${alpha(rosyPink, 0.3)} !important`
                : `transparent !important`,

            '&:hover': {
                backgroundColor: hasAppointments
                    ? `${alpha(rosyPink, 0.5)} !important`
                    : `${alpha(maroon, 0.04)} !important`,
                border: `1px solid ${maroon} !important`,
            },
        };
    }

    // 2. CASE: Standard Day with Appointment
    if (hasAppointments) {
        return {
            backgroundColor: alpha(rosyPink, 0.3),
            color: charcoal,
            '&:hover': {
                backgroundColor: alpha(rosyPink, 0.5),
            },
        };
    }

    // 3. CASE: Selected (Fallback, though disabled in this component)
    if (selected) {
        return {
            backgroundColor: `${charcoal} !important`,
            color: white,
            border: 'none !important',
        };
    }

    if (isTodayCustom && hasAppointments) return (
        {
            backgroundColor: 'red',
        }
    )

    return {};
}) as React.ComponentType<PickersDayProps & { hasAppointments?: boolean; isTodayCustom?: boolean }>;


const LegendDot = styled(Box)<{ bgcolor: string; border?: string }>(({ bgcolor, border }) => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: bgcolor,
    border: border || 'none',
    marginRight: 8,
}));


type AppointmentCalendarProps = {
    appointments: Appointment[];
};



export default function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {

    const theme = useTheme();
    const rosyPink = (theme.palette.text as any).rosyPink || '#CB9A9F';
    const maroon = theme.palette.primary.main;

    // Current Month Range
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    // Next Month Range
    const nextMonth = addMonths(today, 1);
    const nextMonthStart = startOfMonth(nextMonth);
    const nextMonthEnd = endOfMonth(nextMonth);

    // 1. Process appointments
    const appointmentDates = useMemo(() => {
        const dates = new Set<string>();
        appointments.forEach((apt) => {
            if (apt.scheduled_at) {
                const date = parseISO(apt.scheduled_at);
                dates.add(format(date, 'yyyy-MM-dd'));
            }
        });
        return dates;
    }, [appointments]);

    // 2. Custom Day Renderer
    function ServerDay(props: PickersDayProps) {
        const { day, outsideCurrentMonth, ...other } = props;

        const dateObj = day as unknown as Date;
        const dateStr = format(dateObj, 'yyyy-MM-dd');
        const hasAppointments = !outsideCurrentMonth && appointmentDates.has(dateStr);
        const isToday = isSameDay(dateObj, new Date());

        return (
            <CustomPickersDay
                {...other}
                day={day}
                outsideCurrentMonth={outsideCurrentMonth}
                hasAppointments={hasAppointments}
                isTodayCustom={isToday}
            />
        );
    }

    // Shared styles
    const calendarStyles = {
        margin: 0,
        width: '100%',
        '& .MuiPickersCalendarHeader-root': {
            paddingLeft: 0,
            paddingRight: 0,
        },
        '& .MuiDayCalendar-weekDayLabel': {
            color: 'text.secondary',
            fontWeight: 600,
        },
        '& .MuiPickersArrowSwitcher-root': {
            display: 'none',
        },
        '& .MuiPickersCalendarHeader-labelContainer': {
            marginLeft: 'auto',
            marginRight: 'auto',
            pointerEvents: 'none',
        },
        '& .MuiPickersCalendarHeader-switchViewButton': {
            display: 'none',
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.white,
                border: `1px solid ${theme.palette.border.main}`,
                p: theme.shape.padding,
                maxWidth: 680,
                margin: '0 auto',
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                        justifyContent: 'center'
                    }}
                >
                    {/* Calendar 1: Current Month */}
                    <Box sx={{ flex: 1 }}>
                        <DateCalendar
                            referenceDate={currentMonthStart}
                            minDate={currentMonthStart}
                            maxDate={currentMonthEnd}
                            views={['day']}
                            readOnly
                            slots={{ day: ServerDay }}
                            sx={calendarStyles}
                        />
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                    <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

                    {/* Calendar 2: Next Month */}
                    <Box sx={{ flex: 1 }}>
                        <DateCalendar
                            referenceDate={nextMonthStart}
                            minDate={nextMonthStart}
                            maxDate={nextMonthEnd}
                            views={['day']}
                            readOnly
                            slots={{ day: ServerDay }}
                            sx={calendarStyles}
                        />
                    </Box>
                </Box>
            </LocalizationProvider>

            {/* Legend Section */}
            <Box sx={{ px: 2, pb: 0, mt: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LegendDot bgcolor="transparent" border={`1px solid ${maroon}`} />
                        <Typography variant="body2" color="text.secondary">
                            Today
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LegendDot bgcolor={alpha(rosyPink, 0.3)} />
                        <Typography variant="body2" color="text.secondary">
                            Has Appointments
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
