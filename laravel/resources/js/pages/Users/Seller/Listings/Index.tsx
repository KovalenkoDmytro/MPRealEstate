import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import type { PaginatedResponse, RealEstateListing } from "@/types";
import Button from "@/components/common/Button";
import SellerListingCard from "@/components/listings/seller/SellerListingCard";
import { Grid, Box, Typography } from "@mui/material";
import AppPagination from "@/components/common/AppPagination";
import theme from "@/theme";
import IconContainer from "@/components/common/IconContainer";
import IconHome from "@/icons/IconHome";

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
                <Box
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: theme.shape.borderRadius,
                        border: `1px solid ${theme.palette.border.main}`,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.background.white} 60%, ${theme.palette.secondary.main}10 100%)`,
                        textAlign: "center",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <IconContainer bgColor={`${theme.palette.primary.main}12`}>
                            <IconHome color={theme.palette.primary.main} width={22} height={22} />
                        </IconContainer>
                    </Box>

                    <Typography
                        variant="overline"
                        sx={{
                            color: theme.palette.primary.main,
                            letterSpacing: "0.14em",
                            fontWeight: 700,
                            display: "block",
                            mb: 1,
                        }}
                    >
                        Seller Dashboard
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        You do not have any listings yet.
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            maxWidth: 620,
                            mx: "auto",
                            lineHeight: 1.8,
                            mb: 3,
                        }}
                    >
                        Create your first listing to start receiving interest from buyers and manage offers in one place.
                    </Typography>

                    <Box sx={{ maxWidth: 260, mx: "auto" }}>
                        <Button version="primary" link={true} text="Add New Listing" href={route("listings.create")} />
                    </Box>
                </Box>
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
