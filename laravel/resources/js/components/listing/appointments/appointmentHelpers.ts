import { Appointment } from "@/types";

/**
 * Returns the latest pending appointment for a listing.
 * If no pending appointments exist, returns null.
 */
export const getLatestPendingAppointment = (appointments: Appointment[]) => {
    if (!appointments?.length) return null;

    return (
        appointments
            .filter((a) => a.status === "pending")
            .sort(
                (a, b) =>
                    new Date(b.scheduled_at).getTime() -
                    new Date(a.scheduled_at).getTime()
            )[0] || null
    );
};
