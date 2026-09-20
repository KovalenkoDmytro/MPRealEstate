import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import { Grid } from '@mui/material';
import StatCard from '@/components/common/StatCard';
import { statTones } from '@/design/statTones';
import IconUsers from '@/icons/IconUsers';
import IconMyListings from '@/icons/IconMyListings';
import IconMyDeals from '@/icons/IconMyDeals';

type AdminStats = {
    total_users: number;
    total_listings: number;
    total_deals: number;
};

export default function Dashboard({ stats }: { stats: AdminStats }) {
    return (
        <AuthenticatedLayout header="Dashboard" subHeader="Platform-wide overview">
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard label="Total Users" value={stats.total_users} icon={<IconUsers />} {...statTones.primary} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard label="Total Listings" value={stats.total_listings} icon={<IconMyListings />} {...statTones.warm} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard label="Total Deals" value={stats.total_deals} icon={<IconMyDeals />} {...statTones.accent} />
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    );
}
