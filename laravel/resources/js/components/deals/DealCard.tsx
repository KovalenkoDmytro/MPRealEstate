import React from "react";
import { PropertyDetail } from "@/types";
import { Link } from "@inertiajs/react";
import {
    Paper,
    Typography,
    Box,
    Stack,
    Button,
    alpha,
    Chip
} from "@mui/material";
import {
    MonetizationOnRounded,
    HomeRounded,
    EventNoteRounded,
    ArrowForwardRounded,
    HandshakeRounded,
    ErrorOutlineRounded
} from '@mui/icons-material';

interface DealCardProps {
    deal: PropertyDetail;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {

    // Format date specifically as shown in the design (e.g., "Nov 28, 2025")
    const formattedDate = new Date(deal.created_at).toLocaleDateString('en-US', {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 2
        }).format(amount);
    }


    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                bgcolor: '#fff',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header: Broken Status & Title */}
            <Stack spacing={1} mb={3}>
                {deal.is_broken && (
                    <Chip
                        icon={<ErrorOutlineRounded />}
                        label="Deal Broken"
                        color="error"
                        variant="outlined"
                        size="small"
                        sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                    />
                )}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <HandshakeRounded sx={{ color: '#D97706' }} />
                    <Typography variant="h6" fontWeight={800} color="text.primary">
                        {deal.name}
                    </Typography>
                </Stack>
            </Stack>


            <Box
                sx={{
                    bgcolor: alpha('#3B82F6', 0.12), // Light blue background
                    color: '#3B82F6', // Blue text color
                    p: 2,
                    borderRadius: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <Typography variant="h6" fontWeight={800}>
                    {formatCurrency(deal.amount)}
                </Typography>
                <MonetizationOnRounded fontSize="small" />
            </Box>

            <Stack spacing={2} sx={{ mb: 4, flexGrow: 1 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 1.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        borderColor: 'grey.200',
                        bgcolor: 'grey.50'
                    }}
                >
                    <Box sx={{ bgcolor: '#E2E8F0', p: 1, borderRadius: 2, mr: 2, color: '#64748B', display: 'flex' }}>
                        <HomeRounded />
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        <span style={{ fontWeight: 400 }}>Listing: </span>
                        {deal.real_estate_listing.title ?? "N/A"}
                    </Typography>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={{
                        p: 1.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        borderColor: 'grey.200',
                        bgcolor: '#FFF7ED'
                    }}
                >
                    <Box sx={{ bgcolor: '#FFEDD5', p: 1, borderRadius: 2, mr: 2, color: '#F97316', display: 'flex' }}>
                        <EventNoteRounded />
                    </Box>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                        <span style={{ fontWeight: 400 }}>Created: </span>
                        {formattedDate}
                    </Typography>
                </Paper>
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link href={route("deals.show", deal.id)} style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardRounded />}
                        sx={{
                            borderRadius: 5,
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: '#3B82F6',
                            px: 3,
                            '&:hover': {
                                bgcolor: '#2563EB'
                            }
                        }}
                    >
                        View Deal
                    </Button>
                </Link>
            </Box>
        </Paper>
    );
};
