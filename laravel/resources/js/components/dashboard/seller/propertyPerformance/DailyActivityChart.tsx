import ActivityChart from '@/components/dashboard/seller/ActivityChart';
import type { DailyStat } from '@/types/Appointments/sellerAppointmentsStat';

export default function DailyActivityChart({ data }: { data: DailyStat[] }) {
    return <ActivityChart data={data} title="Property views" metric="Views" emptyMessage="Your listing views will appear here when buyers explore your properties." />;
}
