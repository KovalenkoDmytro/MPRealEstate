import {Grid} from "@mui/material";
import StatCard from "@/components/common/StatCard";
import IconConfirm from "@/icons/IconConfirm";
import theme from "@/theme";
import IconTrendingUpBig from "@/icons/IconTrendingUpBig";

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
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D07669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 6V12L16 14" stroke="#D07669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>}
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
