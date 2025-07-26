import { User } from "@/types";
import { Box, Typography } from "@mui/material";

export default function SellerInfo({ seller }: { seller: User }) {
    return (
        <Box mt={4} p={3} border="1px solid #e0e0e0" borderRadius={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                👤 Seller Information
            </Typography>
            <Typography>
                <strong>Name:</strong> {seller.name}
            </Typography>
            <Typography>
                <strong>Email:</strong> {seller.email}
            </Typography>
        </Box>
    );
}
