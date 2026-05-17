import React, { useMemo, useState } from 'react';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {
    Paper,
    Box,
    Typography,
    styled,
    alpha,
    Divider,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Stack,
    useTheme,
} from '@mui/material';
import { Appointment } from '@/types';
import Button from '@/components/common/Button';



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
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Current Month Range
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);

    // Next Month Range
    const nextMonth = addMonths(today, 1);
    const nextMonthStart = startOfMonth(nextMonth);
    const nextMonthEnd = endOfMonth(nextMonth);

    // 1. Process appointments
    const appointmentsByDate = useMemo(() => {
        const appointmentsMap = new Map<string, Appointment[]>();

        appointments.forEach((apt) => {
            if (!apt.scheduled_at || apt.status !== 'accepted') {
                return;
            }

            const date = parseISO(apt.scheduled_at);
            const dateKey = format(date, 'yyyy-MM-dd');
            const appointmentsForDate = appointmentsMap.get(dateKey) ?? [];

            appointmentsForDate.push(apt);
            appointmentsMap.set(dateKey, appointmentsForDate);
        });

        return appointmentsMap;
    }, [appointments]);

    const selectedAppointments = selectedDate ? (appointmentsByDate.get(selectedDate) ?? []) : [];

    const handleDayClick = (dateKey: string) => {
        if ((appointmentsByDate.get(dateKey) ?? []).length === 0) {
            return;
        }

        setSelectedDate(dateKey);
    };

    const closeAppointmentsDialog = () => {
        setSelectedDate(null);
    };

    // 2. Custom Day Renderer
    function ServerDay(props: PickersDayProps) {
        const { day, outsideCurrentMonth, ...other } = props;

        const dateObj = day as unknown as Date;
        const dateStr = format(dateObj, 'yyyy-MM-dd');
        const appointmentCount = outsideCurrentMonth ? 0 : (appointmentsByDate.get(dateStr)?.length ?? 0);
        const hasAppointments = appointmentCount > 0;
        const isToday = isSameDay(dateObj, new Date());
        const tooltipTitle = `${appointmentCount} appointment${appointmentCount === 1 ? '' : 's'}`;

        const dayContent = (
            <CustomPickersDay
                {...other}
                day={day}
                outsideCurrentMonth={outsideCurrentMonth}
                hasAppointments={hasAppointments}
                isTodayCustom={isToday}
                onClick={() => handleDayClick(dateStr)}
                sx={hasAppointments ? { cursor: 'pointer' } : undefined}
            />
        );

        if (!hasAppointments) {
            return dayContent;
        }

        return (
            <Tooltip title={tooltipTitle} arrow placement="top">
                <Box component="span">
                    {dayContent}
                </Box>
            </Tooltip>
        );
    }

    // Shared styles
    const calendarStyles = {
        margin: 0,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        '& .MuiPickersCalendarHeader-root': {
            paddingLeft: { xs: 0, sm: 1 },
            paddingRight: { xs: 0, sm: 1 },
        },
        '& .MuiDayCalendar-weekDayLabel': {
            color: 'text.secondary',
            fontWeight: 600,
            width: { xs: 34, sm: 36 },
            height: { xs: 34, sm: 36 },
        },
        '& .MuiPickersDay-root': {
            width: { xs: 34, sm: 36 },
            height: { xs: 34, sm: 36 },
            margin: { xs: '0 1px', sm: '0 2px' },
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
                p: { xs: 2, md: theme.shape.padding },
                maxWidth: 680,
                width: '100%',
                margin: '0 auto',
                overflow: 'hidden',
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 1, md: 1.5 },
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
            <Box sx={{ px: { xs: 0, sm: 2 }, pb: 0, mt: { xs: 1.5, md: 2 }, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 3 }, justifyContent: 'center', flexWrap: 'wrap' }}>
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

            <Dialog
                open={selectedDate !== null}
                onClose={closeAppointmentsDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: theme.shape.borderRadius,
                        border: `1px solid ${theme.palette.border.main}`,
                        overflow: 'hidden',
                        boxShadow: '0px 24px 80px rgba(87, 42, 77, 0.18)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        px: { xs: 2.5, md: 3 },
                        py: { xs: 2.5, md: 3 },
                        background: `linear-gradient(135deg, ${alpha(maroon, 0.12)} 0%, ${alpha(rosyPink, 0.18)} 100%)`,
                        borderBottom: `1px solid ${theme.palette.border.main}`,
                    }}
                >
                    <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between" flexWrap="wrap" >
                        <Box>
                            <Typography variant="overline" sx={{ color: theme.palette.primary.main, fontWeight: 800, letterSpacing: '0.14em' }}>
                                Daily Appointments
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.text.primary, mt: 0.5 }}>
                                {selectedDate ? format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy') : ''}
                            </Typography>
                        </Box>

                        <Chip
                            label={`${selectedAppointments.length} confirmed`}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                backgroundColor: theme.palette.background.white,
                                color: maroon,
                                border: `1px solid ${alpha(maroon, 0.14)}`,
                            }}
                        />
                    </Stack>
                </DialogTitle>

                <DialogContent
                    sx={{
                        px: { xs: 2.5, md: 3 },
                        py: { xs: 2.5, md: 3 },
                        backgroundColor: theme.palette.background.white,
                    }}
                >
                    <Stack spacing={1.5} mt={2}>
                        {selectedAppointments.map((appointment) => {

                            const scheduledDate = parseISO(appointment.scheduled_at);

                            return (
                                <Box
                                    key={appointment.id}
                                    sx={{
                                        border: `1px solid ${theme.palette.border.main}`,
                                        borderRadius: theme.shape.borderRadius,
                                        px: { xs: 2, md: 2.5 },
                                        py: { xs: 1.75, md: 2 },
                                        background: `linear-gradient(135deg, ${alpha(rosyPink, 0.08)} 0%, ${alpha(maroon, 0.03)} 100%)`,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                {appointment.listing.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                                                {format(scheduledDate, 'p')}
                                            </Typography>
                                            {appointment.listing.street_name && (
                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.75 }}>
                                                    {appointment.listing.unit_number
                                                        ? `${appointment.listing.unit_number} - `
                                                        : ''}
                                                    {appointment.listing.street_number},{' '}
                                                    {appointment.listing.street_name},{' '}
                                                    {appointment.listing.city}
                                                </Typography>
                                            )}
                                        </Box>


                                    </Box>

                                </Box>
                            );
                        })}
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: { xs: 2.5, md: 3 },
                        py: { xs: 2, md: 2.5 },
                        borderTop: `1px solid ${theme.palette.border.main}`,
                        backgroundColor: alpha(rosyPink, 0.04),
                    }}
                >
                    <Button
                        version="primary"
                        text="Close"
                        onClick={closeAppointmentsDialog}
                    />
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
