import {Grid} from "@mui/material";
import StatCard from "@/components/common/StatCard";
import IconConfirm from "@/icons/IconConfirm";
import { success, warning } from "@/design/tokens";
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
                    variant="dashboard"
                    label="Pending Deals"
                    value={pending}
                    detail="Transactions in progress"
                    icon={<IconClock/>}
                    iconBgColor={warning[50]}
                    iconColor={warning[700]}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <StatCard
                    variant="dashboard"
                    label="Closed Deals"
                    value={closed}
                    detail="Completed transactions"
                    icon={<IconConfirm/>}
                    iconBgColor={success[50]}
                    iconColor={success[700]}
                />
            </Grid>
        </Grid>
    )
}
