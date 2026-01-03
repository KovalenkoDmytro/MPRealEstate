import React from 'react';
import {
    Card,
    List,
    ListItem,
    ListItemText,
    Typography,
    Chip,
    Button,
    Box,
    Divider,
    ListItemButton
} from '@mui/material';
import { ArrowForwardRounded } from '@mui/icons-material';
import { Link } from '@inertiajs/react';
import { Offer, OfferStatus } from '@/types/offer';
import {formatCurrency} from "@/helpers/priceHelper";

interface RecentOffersListProps {
    offers: Offer[];
}

// Define how many offers to show initially
const DISPLAY_LIMIT = 5;

export default function RecentOffersList({ offers }: RecentOffersListProps) {


    const getStatusChip = (status: OfferStatus) => {
        let color: 'default' | 'success' | 'warning' | 'error' = 'default';
        switch (status) {
            case OfferStatus.Accepted: color = 'success'; break;
            case OfferStatus.Pending: color = 'warning'; break;
            case OfferStatus.Rejected: color = 'error'; break;
        }
        return <Chip label={status.toUpperCase()} color={color} size="small" sx={{ fontWeight: 600, mr: 2 }} />;
    };

    const displayedOffers = offers.slice(0, DISPLAY_LIMIT);

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                bgcolor: '#ffffff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
            }}
        >
            <Box sx={{ p: 3, pb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                    Recent Offers
                </Typography>
            </Box>

            <List sx={{ p: 0, flexGrow: 1 }}>
                {displayedOffers.map((offer, index) => (
                    <React.Fragment key={offer.id}>
                        {index > 0 && <Divider component="li" />}
                        <ListItem sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <ListItemText
                                primary={<Typography variant="subtitle1" fontWeight={700}>{offer.listing.title}</Typography>}
                                secondary={
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Listing Price: {formatCurrency(offer.listing.price)}</Typography>
                                        <Typography variant="body2" color="text.secondary">My Offer: {formatCurrency(offer.amount)}</Typography>
                                    </Box>
                                }
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getStatusChip(offer.status)}
                                <Button
                                    component={Link}
                                  //  href={route('', offer.id)}
                                    variant="contained" color="primary" size="small"
                                    endIcon={<ArrowForwardRounded fontSize="small" />}
                                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                                >
                                    View Offer
                                </Button>
                            </Box>
                        </ListItem>
                    </React.Fragment>
                ))}


                {offers.length > DISPLAY_LIMIT && (
                    <React.Fragment>
                        <Divider component="li" />
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                               // href={route('buyer.offers.index')}
                                sx={{
                                    p: 3,
                                    justifyContent: 'center',
                                    '&:hover .MuiTypography-root': { color: 'primary.dark' }
                                }}
                            >
                                <Typography
                                    color="primary"
                                    fontWeight={700}
                                    sx={{ display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                                >
                                    See All {offers.length} Offers
                                    <ArrowForwardRounded fontSize="small" sx={{ ml: 1 }} />
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    </React.Fragment>
                )}

                {offers.length === 0 && (
                    <ListItem sx={{ p: 4, justifyContent: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            You have not made any offers yet.
                        </Typography>
                    </ListItem>
                )}
            </List>
        </Card>
    );
}
