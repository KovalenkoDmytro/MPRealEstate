import {Grid} from "@mui/material";
import StatCard from "@/components/common/StatCard";
import { BuyerAppointmentsStat} from "@/types/Appointments/buyerAppointmentsStat";
import IconCalendarToday from "@/icons/IconCalendarToday";
import IconClock from "@/icons/IconClock";
import IconConfirm from "@/icons/IconConfirm";
import IconClose from "@/icons/IconClose";
import IconPending from "@/icons/IconPending";
import IconCanceled from "@/icons/IconCanceled";
import theme from "@/theme";
import React from "react";


type BuyerAppointmentsOverviewCardsType = {
    todayCount: number;
    upcomingCount: number;
    acceptedCount: number;
    rejectedCount?: number;
    pendingCount: number;
    cancelledCount: number;
}

export default function ApointmentsOverviewCards({todayCount = 0, acceptedCount= 0, pendingCount= 0 , rejectedCount= 0, upcomingCount= 0, cancelledCount =0}: BuyerAppointmentsOverviewCardsType) {
    return (
        <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                    label="Todays"
                    value={todayCount}
                    icon={<IconClock/>}
                    iconBgColor="#D076691A"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                    label="Accepted"
                    value={acceptedCount}
                    icon={<IconConfirm/>}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                    label="Pending"
                    value={pendingCount}
                    icon={<IconPending/>}
                    iconBgColor="#2C233E1A"
                />
            </Grid>

            {!!rejectedCount &&
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        label="Rejected"
                        value={rejectedCount}
                        icon={<IconClose/>}
                        iconBgColor="#4A5565"
                    />
                </Grid> }



            <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                    label="Upcoming"
                    value={upcomingCount}
                    icon={<IconCalendarToday/>}
                    iconBgColor="#572A4D1A"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                    label="Cancelled"
                    value={cancelledCount}
                    icon={<IconClose/>}
                    iconBgColor="#4A5565"
                />
            </Grid>
        </Grid>
    )
}
