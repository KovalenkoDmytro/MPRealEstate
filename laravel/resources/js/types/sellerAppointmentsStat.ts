export interface DailyStat {
    date: string;
    total: number;
}

export interface SellerStats {
    summary: {
        total_last_30_days: number;
        breakdown: {
            pending: number;
            completed: number;
            cancelled: number;
        }
    };
    chart_data: {
        last_7_days: DailyStat[];
    };
}
