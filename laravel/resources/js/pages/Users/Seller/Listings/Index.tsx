import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import type { PaginatedResponse, RealEstateListing } from "@/types";
import Button from "@/components/common/Button";
import SellerListingCard from "@/components/listings/seller/SellerListingCard";
import { Box, Typography } from "@mui/material";
import AppPagination from "@/components/common/AppPagination";
import { neutral } from '@/design/tokens';
import { AddRounded } from '@mui/icons-material';
import IconContainer from "@/components/common/IconContainer";
import IconHome from "@/icons/IconHome";
import EmptyState from "@/design/EmptyState";

type ComponentProps = {
    listings: PaginatedResponse<RealEstateListing>;
};

export default function Index({ listings }: ComponentProps) {
    const hasListings = Boolean(listings?.data?.length);

    return (
        <AuthenticatedLayout header="My Listings">

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box><Typography component="h2" sx={{ color: neutral[0], fontWeight: 700, fontSize: '1.25rem' }}>{listings.total} {listings.total === 1 ? 'property' : 'properties'}</Typography><Typography variant="body2" sx={{ color: neutral[300], mt: 0.5 }}>Manage your properties and keep listings up to date.</Typography></Box>
                <Button version="primary" link text="Add new listing" icon={<AddRounded />} fullWidth={false} href={route('listings.create')} />
            </Box>

            {hasListings ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, '@media (min-width: 1800px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }, gap: 2.5 }}>
                    {listings.data.map((listing) => <SellerListingCard key={listing.id} listing={listing} />)}
                </Box>
            ) : (
                <EmptyState
                    icon={
                        <IconContainer>
                            <IconHome width={22} height={22} />
                        </IconContainer>
                    }
                    eyebrow="Seller Dashboard"
                    title="You do not have any listings yet."
                    description="Create your first listing to start receiving interest from buyers and manage offers in one place."
                    action={
                        <Box sx={{ maxWidth: 260, mx: "auto" }}>
                            <Button version="primary" link={true} text="Add New Listing" href={route("listings.create")} />
                        </Box>
                    }
                />
            )}

            {hasListings && <AppPagination pagination={listings} />}

        </AuthenticatedLayout>
    );

}
