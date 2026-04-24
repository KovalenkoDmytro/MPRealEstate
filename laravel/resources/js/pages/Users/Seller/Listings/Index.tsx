import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import type { PaginatedResponse, RealEstateListing } from "@/types";
import Button from "@/components/common/Button";
import SellerListingCard from "@/components/listings/seller/SellerListingCard";
import { Stack, Box } from "@mui/material";
import AppPagination from "@/components/common/AppPagination";
import theme from "@/theme";

type ComponentProps = {
    listings: PaginatedResponse<RealEstateListing>;
};

export default function Index({ listings }: ComponentProps) {
    return (
        <AuthenticatedLayout header="My Listings">

            <Stack spacing={4}>
                {listings.data.map((listing, index) => (
                    <SellerListingCard listing={listing} key={index}/>
                ))}
            </Stack>

            <AppPagination pagination={listings} />

            <Box
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 1000,
                    borderRadius: theme.shape.borderRadius,
                    padding: 1,
                    backgroundColor: theme.palette.background.white,
                    boxShadow: 3,
                    display: { xs: "none", md: "block" }
                }} >
                <Button version={"primary"} link={true} text={"Add New Listing"} href={route('listings.create')}/>
            </Box>

        </AuthenticatedLayout>
    );

}
