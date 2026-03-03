import {Grid} from "@mui/material";
import StatCard from "@/components/common/StatCard";
import IconConfirm from "@/icons/IconConfirm";
import theme from "@/theme";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";
import IconClock from "@/icons/IconClock";

type DealsOverviewCardsType = {
    active: number;
    pending: number;
    closed: number;
}

export default function DealsOverviewCards({active, pending, closed}: DealsOverviewCardsType) {
    return (
        <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                    label="Active Deals"
                    value={active}
                    icon={<IconTrendingUpBig/>}
                    iconBgColor="#572A4D1A"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                    label="Pending Offers"
                    value={pending}
                    icon={<IconClock/>}
                    iconBgColor="#D076691A"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                    label="Closed Deals"
                    value={closed}
                    icon={<IconConfirm/>}
                    iconBgColor={theme.palette.primary.main}
                />
            </Grid>
        </Grid>
    )
}
