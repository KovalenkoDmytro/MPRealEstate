import { useMemo } from 'react';
import { Box, Stack, Typography } from "@mui/material";
import { PropertyDetail } from '@/types';
import { DealCard } from './DealCard';
import DealsOverviewCards from "@/pages/Users/Buyer/Deals/DealsOverviewCards";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/common/Button";
import IconContainer from "@/components/common/IconContainer";
import IconMyDeals from "@/icons/IconMyDeals";
import theme from "@/theme";

interface DealsListProps {
    deals: PropertyDetail[];
}

export const DealsList = ({ deals }: DealsListProps) => {
    const user = useAuth();
    const role = user.role;
    const hasDeals = deals.length > 0;

    const dealStats = useMemo(() => {
        return deals.reduce((acc, deal) => {
            if (deal.is_completed) {
                acc.closed += 1;
            } else if (deal.is_broken) {
                acc.broken += 1;
            } else {
                acc.active += 1;
            }

            return acc;
        }, { active: 0, pending: 0, closed: 0, broken: 0 });
    }, [deals]);

    if (!hasDeals) {
        const description = role === "buyer"
            ? "You do not have any deals yet. Browse listings and submit an offer to start your first transaction."
            : role === "seller"
                ? "You do not have any deals yet. Once a buyer accepts your listing and the process moves forward, your deals will appear here."
                : "You do not have any assigned deals yet. Once you are invited into a transaction, it will appear here for review and coordination.";

        const ctaText = role === "buyer"
            ? "Browse Listings"
            : role === "seller"
                ? "My Listings"
                : null;

        const ctaHref = role === "buyer"
            ? route("listings.index")
            : role === "seller"
                ? route("listings.index")
                : undefined;

        return (
            <Box
                sx={{
                    mt: 2,
                    p: { xs: 3, md: 5 },
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.border.main}`,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.background.white} 60%, ${theme.palette.secondary.main}10 100%)`,
                    textAlign: "center",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <IconContainer bgColor={`${theme.palette.primary.main}12`}>
                        <IconMyDeals color={theme.palette.primary.main} width={22} height={22} />
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
                    Deals Center
                </Typography>

                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    No deals available.
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        maxWidth: 620,
                        mx: "auto",
                        lineHeight: 1.8,
                        mb: ctaText ? 3 : 0,
                    }}
                >
                    {description}
                </Typography>

                {ctaText && ctaHref && (
                    <Box sx={{ maxWidth: 260, mx: "auto" }}>
                        <Button
                            version="primary"
                            link={true}
                            text={ctaText}
                            href={ctaHref}
                        />
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Stack spacing={2}>

            <DealsOverviewCards
                active={dealStats.active}
                pending={dealStats.pending}
                closed={dealStats.closed}
            />

            {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
            ))}
        </Stack>
    );
};
