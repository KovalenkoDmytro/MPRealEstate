import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import {Head} from "@inertiajs/react";
import {Offer} from "@/types";
import OffersGrid from "@/components/offers/OffersGrid/OffersGrid";
import {OfferStats} from "@/types/models";
import {Grid} from "@mui/material";
import StatCard from "@/components/common/StatCard";

type OffersIndexPageProps = {
    offers: Offer[];
    offers_stats: OfferStats
};

export default function DealIndexPage({ offers, offers_stats }: OffersIndexPageProps) {
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
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D07669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 6V12L16 14" stroke="#D07669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>}
                        iconBgColor="#D076691A"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        label="Accepted"
                        value={offers_stats.accepted}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M21.801 9.99999C22.2577 12.2413 21.9322 14.5714 20.8788 16.6018C19.8255 18.6322 18.1079 20.24 16.0125 21.1573C13.9171 22.0746 11.5706 22.2458 9.36428 21.6424C7.15795 21.0389 5.22517 19.6974 3.88825 17.8414C2.55134 15.9854 1.8911 13.7272 2.01764 11.4434C2.14418 9.15952 3.04986 6.98808 4.58363 5.29116C6.1174 3.59424 8.18656 2.47442 10.446 2.11844C12.7055 1.76247 15.0188 2.19185 17 3.33499" stroke="#572A4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 11L12 14L22 4" stroke="#572A4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>}
                        iconBgColor="#572A4D1A"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        label="Rejected"
                        value={offers_stats.rejected}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#99A1AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 9L9 15" stroke="#99A1AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 9L15 15" stroke="#99A1AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>}
                        iconBgColor="#F3F4F6"
                    />
                </Grid>
            </Grid>

            <OffersGrid offers={offers} />
        </AuthenticatedLayout>
    );
}
