import React from "react";
import { PropertyDetail } from "@/types";
import { Link } from "@inertiajs/react";

// MUI imports
import { Card, CardContent, Typography, Box } from "@mui/material";

interface DealCardProps {
    deal: PropertyDetail;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {

    const formattedDate = new Date(deal.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });


    return (
        <Card
            variant="outlined"
            sx={{
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 },
                borderRadius: 2,
            }}
        >
            <CardContent>
                {/* Broken Deal Status */}
                {deal.is_broken && (
                    <Typography color="error" fontWeight="bold" variant="subtitle1">
                        ❌ Deal has been broken
                    </Typography>
                )}

                {/* Deal Title */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {deal.name}
                </Typography>

                {/* Deal Amount */}
                <Typography variant="body1">
                    💰 <strong>Amount:</strong> ${deal.amount.toLocaleString()}
                </Typography>

                {/* Listing Title */}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    🏡 <strong>Listing:</strong> {deal.real_estate_listing.title ?? "N/A"}
                </Typography>

                {/* Deal Date */}
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    📅 Created: {formattedDate}
                </Typography>

                {/* View Deal Link */}
                <Box mt={2}>
                    <Link
                        href={route("deals.show", deal.id)}
                        style={{
                            color: "#1976d2",
                            textDecoration: "none",
                            fontWeight: 500,
                        }}
                    >
                        View Deal →
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};
