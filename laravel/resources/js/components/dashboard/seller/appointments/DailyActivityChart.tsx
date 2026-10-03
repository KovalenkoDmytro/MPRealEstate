import ActivityChart from '@/components/dashboard/seller/ActivityChart';
import type { DailyStat } from '@/types/Appointments/sellerAppointmentsStat';

export default function DailyActivityChart({ data }: { data: DailyStat[] }) {
    return <ActivityChart data={data} title="Appointments per day" metric="Appointments" emptyMessage="Confirmed visits will appear here as your schedule fills up." />;
}
