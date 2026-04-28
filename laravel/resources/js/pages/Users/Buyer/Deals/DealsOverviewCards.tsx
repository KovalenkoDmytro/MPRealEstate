import {Grid} from "@mui/material";
import StatCard from "@/components/common/StatCard";
import IconConfirm from "@/icons/IconConfirm";
import theme from "@/theme";
import IconClock from "@/icons/IconClock";

type DealsOverviewCardsType = {
    pending: number;
    closed: number;
}

export default function DealsOverviewCards({pending, closed}: DealsOverviewCardsType) {
    return (
        <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>
                <StatCard
                    label="Pending Deals"
                    value={pending}
                    icon={<IconClock/>}
                    iconBgColor={theme.colors.warning}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <StatCard
                    label="Closed Deals"
                    value={closed}
                    icon={<IconConfirm/>}
                    iconBgColor={theme.colors.success}
                />
            </Grid>
        </Grid>
    )
}
