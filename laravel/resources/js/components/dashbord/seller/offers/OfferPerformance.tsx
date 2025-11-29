import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
    LocalOffer,      // Icon for Total
    CheckCircle,     // Icon for Accepted
    Cancel,          // Icon for Rejected
    PendingActions   // Icon for Pending
} from '@mui/icons-material';

import OfferMetricCard from './OfferMetricCard';
import {OfferStats} from "@/components/dashbord/seller/offers/type";


interface OfferPerformanceProps {
    stats: OfferStats;
}

export default function OfferPerformance({ stats }: OfferPerformanceProps) {
    return (
        <Box sx={{ mb: 6 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Box sx={{ p: 1, bgcolor: '#FFF7ED', borderRadius: 2, color: '#EA580C', display: 'flex' }}>
                    <LocalOffer fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    Offer Activity
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* 1. Pending (Most Important - Needs Attention) */}
                <Grid size={{xs:12, sm:6, md:3}}>
                    <OfferMetricCard
                        title="Pending Response"
                        value={stats.pending}
                        type="pending"
                        icon={<PendingActions />}
                    />
                </Grid>

                {/* 2. Accepted */}
                <Grid size={{xs:12, sm:6, md:3}}>
                    <OfferMetricCard
                        title="Accepted"
                        value={stats.accepted}
                        type="accepted"
                        icon={<CheckCircle />}
                    />
                </Grid>

                {/* 3. Rejected */}
                <Grid size={{xs:12, sm:6, md:3}}>
                    <OfferMetricCard
                        title="Rejected"
                        value={stats.rejected}
                        type="rejected"
                        icon={<Cancel />}
                    />
                </Grid>

                {/* 4. Total */}
                <Grid size={{xs:12, sm:6, md:3}}>
                    <OfferMetricCard
                        title="Total Received"
                        value={stats.total}
                        type="total"
                        icon={<LocalOffer />}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
