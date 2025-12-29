export interface OfferStats {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
}

export interface AppointmentsStats {
    // totalCount: number;
    nextAppointmentDate: string | null;
    pendingCount: number;
    acceptedCount: number;
}

export interface DealStats {
    total: number;
    broken: number;
    completed: number;
    pending: number;
}

export interface PerformanceStats {
    favorites: {
        total: number;
    };
    views: {
        total: number;
        unique: number;
        today: number;
        last_7_days: number;
    };
}
