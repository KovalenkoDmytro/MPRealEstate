import React from 'react';
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { Offer, PaginatedResponse } from "@/types";
import OffersGrid from "@/components/offers/OffersGrid/OffersGrid";
import {Grid} from "@mui/material";
import StatCard from "@/components/common/StatCard";
import {OfferStats} from "@/types/models";
import IconConfirm from "@/icons/IconConfirm";
import IconClose from "@/icons/IconClose";
import IconClock from "@/icons/IconClock";

type OffersIndexPageProps = {
    offers: PaginatedResponse<Offer>;
    offers_stats: OfferStats
};

export default function OffersIndexPage({ offers, offers_stats }: OffersIndexPageProps) {
    return (
        <AuthenticatedLayout
            header="My Offers"
            subHeader="Review and manage offers on your properties"
        >
            <Grid container spacing={3}>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        label="Pending"
                        value={offers_stats.pending}
                        icon={<IconClock/>}
                        iconBgColor="#D076691A"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        label="Accepted"
                        value={offers_stats.accepted}
                        icon={<IconConfirm/>}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        label="Rejected"
                        value={offers_stats.rejected}
                        icon={<IconClose/>}
                        iconBgColor="#4A5565"
                    />
                </Grid>
            </Grid>
            <OffersGrid offers={offers} />
        </AuthenticatedLayout>
    );
}
