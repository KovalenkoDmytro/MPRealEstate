import { useMemo, useState } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Paper, Box, Typography, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { CalendarMonthRounded, AccessTimeRounded } from '@mui/icons-material';
import { Appointment } from '@/types';
import Button from '@/components/common/Button';
import { neutral, primary, radius } from '@/design/tokens';

type AppointmentCalendarProps = { appointments: Appointment[] };

export default function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const appointmentsByDate = useMemo(() => {
        const grouped = new Map<string, Appointment[]>();
        appointments.forEach((appointment) => {
            if (!appointment.scheduled_at || appointment.status !== 'accepted') return;
            const key = format(parseISO(appointment.scheduled_at), 'yyyy-MM-dd');
            grouped.set(key, [...(grouped.get(key) ?? []), appointment]);
        });
        return grouped;
    }, [appointments]);
    const selectedAppointments = selectedDate ? appointmentsByDate.get(selectedDate) ?? [] : [];

    function AppointmentDay(props: PickersDayProps) {
        const key = format(props.day, 'yyyy-MM-dd');
        const count = props.outsideCurrentMonth ? 0 : appointmentsByDate.get(key)?.length ?? 0;
        const today = isSameDay(props.day, new Date());
        return (
            <Tooltip title={count ? `${count} confirmed appointment${count === 1 ? '' : 's'}` : ''} arrow>
                <Box component="span" sx={{ position: 'relative' }}>
                    <PickersDay {...props} onClick={() => { if (count) setSelectedDate(key); }} sx={{
                        borderRadius: radius.sm, fontWeight: today || count ? 700 : 400,
                        ...(count && { bgcolor: primary[50], color: primary[700] }),
                        ...(today && { border: `1px solid ${primary[600]}`, color: primary[600] }),
                        '&.Mui-selected': { bgcolor: primary[600], color: neutral[0] },
                    }} />
                    {count > 0 && <Box sx={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', bgcolor: primary[600], pointerEvents: 'none' }} />}
                </Box>
            </Tooltip>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: neutral[50], borderRadius: radius.lg, border: `1px solid ${neutral[200]}`, minWidth: 0 }}>
            <Stack direction="row" spacing={1.25} alignItems="center" mb={1}>
                <Box sx={{ display: 'flex', p: 1, bgcolor: primary[50], color: primary[600], borderRadius: radius.sm }}><CalendarMonthRounded /></Box>
                <Typography component="h2" variant="h6" fontWeight={700}>Your calendar</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: neutral[600], mb: 1 }}>Select a highlighted day to see your visits.</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar views={['day']} readOnly slots={{ day: AppointmentDay }} sx={{
                    width: '100%', maxWidth: 320, mx: 'auto', height: 320,
                    '& .MuiPickersCalendarHeader-root': { px: 0, ml: 0, mr: 0 },
                    '& .MuiPickersCalendarHeader-label': { fontWeight: 700, fontSize: '0.95rem' },
                    '& .MuiPickersCalendarHeader-switchViewButton': { display: 'none' },
                    '& .MuiDayCalendar-weekDayLabel': { width: 'calc(100% / 7)', m: 0, fontWeight: 600, color: neutral[500] },
                    '& .MuiDayCalendar-weekContainer': { justifyContent: 'space-between', mx: 0 },
                    '& .MuiPickersDay-root': { width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, mx: 0 },
                }} />
            </LocalizationProvider>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 2, borderTop: `1px solid ${neutral[200]}`, color: neutral[600] }}>
                <Stack direction="row" spacing={0.75} alignItems="center"><Box sx={{ width: 10, height: 10, borderRadius: '50%', border: `1px solid ${primary[600]}` }} /><Typography variant="caption">Today</Typography></Stack>
                <Stack direction="row" spacing={0.75} alignItems="center"><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: primary[600] }} /><Typography variant="caption">Confirmed visits</Typography></Stack>
            </Stack>
            <Dialog open={selectedDate !== null} onClose={() => setSelectedDate(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: neutral[50], borderRadius: radius.lg } }}>
                <DialogTitle component="div" sx={{ borderBottom: `1px solid ${neutral[200]}` }}>
                    <Typography variant="overline" color="primary">Confirmed visits · {selectedAppointments.length}</Typography>
                    <Typography variant="h6" fontWeight={700}>{selectedDate ? format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy') : ''}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1.5} mt={2}>
                        {selectedAppointments.map((appointment) => (
                            <Box key={appointment.id} sx={{ p: 2, bgcolor: neutral[0], border: `1px solid ${neutral[200]}`, borderRadius: radius.md }}>
                                <Typography fontWeight={700}>{appointment.listing.title}</Typography>
                                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ my: 1, color: primary[700] }}><AccessTimeRounded sx={{ fontSize: 18 }} /><Typography variant="body2" fontWeight={600}>{format(parseISO(appointment.scheduled_at), 'p')}</Typography></Stack>
                                <Typography variant="body2" color="text.secondary">{appointment.listing.unit_number ? `${appointment.listing.unit_number} - ` : ''}{appointment.listing.street_number} {appointment.listing.street_name}, {appointment.listing.city}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}><Button version="primary" text="Close" fullWidth={false} onClick={() => setSelectedDate(null)} /></DialogActions>
            </Dialog>
        </Paper>
    );
}
