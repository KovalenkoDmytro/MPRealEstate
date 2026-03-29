import { useMemo } from "react";
import { Deal, PropertyDetail } from "@/types";
// If InfoBlock is default export, change this import accordingly
import { InfoBlock } from "@/components/InfoBlock";
import { format, parseISO, isValid as isValidDate } from "date-fns";

type Role = "buyer" | "seller";
type Feature = "deposit" | "conditionDay" | "possessionDay";

type Props = {
    deal: Deal | PropertyDetail;
    role: Role;
    feature: Feature;
};

function toDateLike(v: unknown): Date | null {
    if (!v) return null;
    if (v instanceof Date) return v;
    if (typeof v === "string") {
        const iso = parseISO(v);
        if (isValidDate(iso)) return iso;
        const d = new Date(v);
        return isValidDate(d) ? d : null;
    }
    const d = new Date(v as any);
    return isValidDate(d) ? d : null;
}

export default function DealStatusBanner({ deal, role, feature }: Props) {
    const d: any = deal; // unify Deal | PropertyDetail access

    const banner = useMemo(() => {
        // ----------------- DEPOSIT -----------------
        if (feature === "deposit") {
            if (role === "buyer") {
                if (d.is_security_deposit_confirmed && d.security_deposit_confirmed_at) {
                    const at = toDateLike(d.security_deposit_confirmed_at);
                    return {
                        type: "success" as const,
                        title: "Security deposit confirmed",
                        message: `Seller confirmed receiving ${d.security_deposit}${
                            at ? ` on ${format(at, "PPpp")}` : ""
                        }.`,
                    };
                }
                if (d.security_deposit_made_at && !d.is_security_deposit_confirmed) {
                    const at = toDateLike(d.security_deposit_made_at);
                    return {
                        type: "warning" as const,
                        title: "Awaiting confirmation",
                        message: `Waiting for the seller to confirm your deposit${
                            at ? ` (marked made on ${format(at, "PPpp")})` : ""
                        }.`,
                    };
                }
                if (d.security_deposit && !d.is_security_deposit_made) {
                    return {
                        type: "warning" as const,
                        title: "Action required",
                        message: `Seller set a required security deposit of ${d.security_deposit}. Please make the deposit and confirm below.`,
                    };
                }
                return null;
            } else {
                if (d.security_deposit && d.is_security_deposit_confirmed) {
                    const at = toDateLike(d.security_deposit_confirmed_at);
                    return {
                        type: "success" as const,
                        title: "Security deposit received",
                        message: `You received ${d.security_deposit}${
                            at ? ` on ${format(at, "PPpp")}` : ""
                        }.`,
                    };
                }
                if (d.security_deposit && d.security_deposit_set_at && !d.is_security_deposit_made) {
                    const at = toDateLike(d.security_deposit_set_at);
                    return {
                        type: "warning" as const,
                        title: "Under consideration",
                        message: `Waiting for the buyer to confirm the deposit${
                            at ? ` (set on ${format(at, "PPpp")})` : ""
                        }.`,
                    };
                }
                if (d.security_deposit) {
                    const at = toDateLike(d.security_deposit_set_at);
                    return {
                        type: "success" as const,
                        title: "Security deposit set",
                        message: `You set the deposit to ${d.security_deposit}${
                            at ? ` on ${format(at, "PPpp")}` : ""
                        }.`,
                    };
                }
                return null;
            }
        }

        // ----------------- CONDITION DAY -----------------
        if (feature === "conditionDay") {
            const day = toDateLike(d.condition_day);
            const dayStr = day ? format(day, "PPP") : d.condition_day;

            if (role === "buyer") {
                if (d.condition_day && !d.is_condition_day_confirmed) {
                    return {
                        type: "warning" as const,
                        title: "Under consideration",
                        message: `Waiting for the seller to confirm the condition day for ${dayStr}.`,
                    };
                }
                if (d.condition_day && d.is_condition_day_confirmed) {
                    const at = toDateLike(d.condition_day_confirmed_at);
                    return {
                        type: "success" as const,
                        title: "Condition day confirmed",
                        message: `The seller confirmed the condition day for ${dayStr}${
                            at ? ` on ${format(at, "PPpp")}` : ""
                        }.`,
                    };
                }
                return null;
            } else {
                if (d.condition_day && !d.is_condition_day_confirmed) {
                    return {
                        type: "warning" as const,
                        title: "Pending confirmation",
                        message: `Buyer selected ${dayStr}. Please confirm if correct.`,
                    };
                }
                if (d.condition_day && d.is_condition_day_confirmed) {
                    const at = toDateLike(d.condition_day_confirmed_at);
                    return {
                        type: "success" as const,
                        title: "Condition day confirmed",
                        message: `You confirmed ${dayStr}${at ? ` on ${format(at, "PPpp")}` : ""}.`,
                    };
                }
                return null;
            }
        }

        // ----------------- POSSESSION DAY -----------------
        if (feature === "possessionDay") {
            const day = toDateLike(d.possession_day);
            const dayStr = day ? format(day, "PPP") : d.possession_day;

            if (role === "buyer") {
                if (d.possession_day && !d.is_possession_day_confirmed) {
                    return {
                        type: "warning" as const,
                        title: "Under consideration",
                        message: `Waiting for the seller to confirm the possession day for ${dayStr}.`,
                    };
                }
                if (d.possession_day && d.is_possession_day_confirmed) {
                    const at = toDateLike(d.possession_day_confirmed_at);
                    return {
                        type: "success" as const,
                        title: "Possession day confirmed",
                        message: `The seller confirmed the possession day for ${dayStr}${
                            at ? ` on ${format(at, "PPpp")}` : ""
                        }.`,
                    };
                }
                return null;
            } else {
                if (d.possession_day && !d.is_possession_day_confirmed) {
                    return {
                        type: "warning" as const,
                        title: "Pending confirmation",
                        message: `Buyer selected ${dayStr}. Please confirm if correct.`,
                    };
                }
                if (d.possession_day && d.is_possession_day_confirmed) {
                    const at = toDateLike(d.possession_day_confirmed_at);
                    return {
                        type: "success" as const,
                        title: "Possession day confirmed",
                        message: `You confirmed ${dayStr}${at ? ` on ${format(at, "PPpp")}` : ""}.`,
                    };
                }
                return null;
            }
        }

        return null;
    }, [d, role, feature]);

    if (!banner) return null;
    return <InfoBlock type={banner.type} title={banner.title} message={banner.message} />;
}
