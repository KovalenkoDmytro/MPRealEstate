// resources/js/helpers/dateHelpers.ts

/**
 * Formats a JavaScript Date object into an ISO string
 * that preserves the user's local timezone.
 *
 * Example output:
 *   2025-02-04T15:30:00-07:00
 */
export function formatWithTimezone(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    // timezone offset in minutes (negative = ahead of UTC)
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHours}:${offsetMinutes}`;
}
