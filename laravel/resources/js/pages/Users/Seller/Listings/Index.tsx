import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import type { PaginatedResponse, RealEstateListing } from "@/types";
import Button from "@/components/common/Button";
import SellerListingCard from "@/components/listings/seller/SellerListingCard";
import { Grid, Box, Typography } from "@mui/material";
import AppPagination from "@/components/common/AppPagination";
import theme from "@/theme";
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

            {hasListings ? (
                <Grid container spacing={3}>
                    {listings.data.map((listing, index) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                            <SellerListingCard listing={listing} />
                        </Grid>
                    ))}
                </Grid>
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

            <Box
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 1000,
                    borderRadius: theme.shape.borderRadius,
                    padding: 1,
                    backgroundColor: theme.palette.background.white,
                    display: hasListings ? { xs: "none", md: "block" } : "none",
                }} >
                <Button version={"primary"} link={true} text={"Add New Listing"} href={route('listings.create')}/>
            </Box>

        </AuthenticatedLayout>
    );

}
