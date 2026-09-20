import { primary, neutral, accent } from './tokens';

// rgb-equivalents of the token hexes below, needed for rgba() gradient stops.
const ACCENT_400_RGB = '206, 109, 61'; // accent[400] #CE6D3D
const PRIMARY_600_RGB = '59, 91, 219'; // primary[600] #3B5BDB
const ACCENT_300_RGB = '224, 143, 98'; // accent[300] #E08F62

function tint(rgb: string, angle: number) {
    return `linear-gradient(${angle}deg, rgba(${rgb}, 0.10) 0%, rgba(${rgb}, 0.05) 100%)`;
}

/**
 * Shared iconBgColor/background pairs for dashboard StatCard tones, replacing
 * the hardcoded hex sets duplicated across AppointmentStats/DealPerformance/
 * OfferPerformance/PropertyPerformance.
 */
export const statTones = {
    warm: { iconBgColor: accent[400], background: tint(ACCENT_400_RGB, 135) },
    primary: { iconBgColor: primary[600], background: tint(PRIMARY_600_RGB, 135) },
    neutral: { iconBgColor: neutral[600], background: `linear-gradient(135deg, ${neutral[100]} 0%, ${neutral[50]} 100%)` },
    accent: { iconBgColor: accent[300], background: tint(ACCENT_300_RGB, 90) },
} as const;
