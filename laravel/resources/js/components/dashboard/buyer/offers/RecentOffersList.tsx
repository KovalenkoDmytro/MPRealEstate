import React from 'react';
import { Offer } from '@/types/offer';
import RecentOfferItem from "@/components/dashboard/buyer/offers/RecentOfferItem";
import {Stack, Typography} from "@mui/material";
import RecentOffersHeader from "@/components/dashboard/buyer/offers/RecentOffersHeader";
import RecentOffersFooter from "@/components/dashboard/buyer/offers/RecentOffersFooter";

interface RecentOffersListProps {
    offers: Offer[];
}

const DISPLAY_LIMIT = 3;

export default function RecentOffersList({ offers }: RecentOffersListProps) {
    // console.log(offers);
    const displayedOffers = offers.slice(0, DISPLAY_LIMIT);
    const hasMore = offers.length > DISPLAY_LIMIT;

    return (
        <div className="recent-offers-list">

            <RecentOffersHeader total={offers.length}/>

            <Stack
                spacing={2}
                sx={{
                    mt: 2, mb: hasMore ? 1 : 0
                }}
            >

                {displayedOffers.map((offer) => (
                    <RecentOfferItem key={offer.id} offer={offer} />
                ))}


                {offers.length === 0 && (
                    <Typography variant="h6">
                        You have not made any offers yet.
                    </Typography>
                )}

            </Stack>

            {hasMore && (
                <RecentOffersFooter count={offers.length} href={route('offers.index')} />
            )}
        </div>
    );
}
