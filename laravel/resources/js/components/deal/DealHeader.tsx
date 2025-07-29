import { Deal } from "@/types";
import { Box, Typography, Stack } from "@mui/material";

export default function DealHeader({ deal }: { deal: Deal }) {
    return (
        <Box mb={3}>
            {/* Deal Title */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {deal.name}
            </Typography>

            {/* Amount and Description */}
            <Stack spacing={1}>
                <Typography variant="h6">
                    💰 <strong>Amount:</strong> ${deal.amount.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                    📝 <strong>Description:</strong> {deal.seller_message}
                </Typography>
            </Stack>
        </Box>
    );
}
