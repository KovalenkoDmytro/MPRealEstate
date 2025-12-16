import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
    LocalOfferRounded,
    CheckCircleRounded,
    CancelRounded,
    PendingActionsRounded
} from '@mui/icons-material';

import OfferMetricCard from './OfferMetricCard';
import { OfferStats } from "@/components/dashbord/seller/offers/type";

interface OfferPerformanceProps {
    stats: OfferStats;
}

export default function OfferPerformance({ stats }: OfferPerformanceProps) {
    return (
        <Box sx={{ mb: 6 }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <Box sx={{ p: 1, bgcolor: '#FFF7ED', borderRadius: 2, color: '#F97316', display: 'flex' }}>
                    <LocalOfferRounded fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Offer Activity
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <OfferMetricCard
                        title="Pending Response"
                        value={stats.pending}
                        type="pending"
                        icon={<PendingActionsRounded />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <OfferMetricCard
                        title="Accepted"
                        value={stats.accepted}
                        type="accepted"
                        icon={<CheckCircleRounded />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <OfferMetricCard
                        title="Rejected"
                        value={stats.rejected}
                        type="rejected"
                        icon={<CancelRounded />}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <OfferMetricCard
                        title="Total Received"
                        value={stats.total}
                        type="total"
                        icon={<LocalOfferRounded />}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
