import { Box, Typography, Grid, Stack } from '@mui/material';
import { OfferStats } from "@/types/models";
import StatCard from "@/components/common/StatCard";
import SectionCard from "@/design/SectionCard";
import { statTones } from "@/design/statTones";
import IconDollar from "@/icons/IconDollar";
import IconConfirm from "@/icons/IconConfirm";
import IconClose from "@/icons/IconClose";
import IconClock from "@/icons/IconClock";
import IconInbox from "@/icons/IconInbox";
import IconContainer from "@/components/common/IconContainer";

interface OfferPerformanceProps {
    stats: OfferStats;
    view?: 'column' | 'row';
}

export default function OfferPerformance({ stats, view = 'row' }: OfferPerformanceProps) {

    const statCards = [
        {
            label: "Pending Response",
            value: stats.pending,
            icon: <IconClock/>,
            ...statTones.warm,
        },
        {
            label: "Accepted",
            value: stats.accepted,
            icon: <IconConfirm/>,
            ...statTones.primary,
        },
        {
            label: "Rejected",
            value: stats.rejected,
            icon: <IconClose/>,
            ...statTones.neutral,
        },
        {
            label: "Total Received",
            value: stats.total,
            icon: <IconInbox/>,
            ...statTones.accent,
        }
    ];

    return (
        <SectionCard>

            <Stack gap={1.5} mb={4}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <IconContainer>
                        <IconDollar/>
                    </IconContainer>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Offer Activity
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    Response tracking
                </Typography>
            </Stack>


            {view === 'column' ? (
                <Stack spacing={3}>
                    {statCards.map((card, index) => (
                        <StatCard key={index} {...card} />
                    ))}
                </Stack>
            ) : (
                <Grid container spacing={3}>
                    {statCards.map((card, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <StatCard {...card} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </SectionCard>
    );
}
