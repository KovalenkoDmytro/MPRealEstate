import { useMemo } from 'react';
import { Stack} from "@mui/material";
import { PropertyDetail } from '@/types';
import { DealCard } from './DealCard';
import DealsOverviewCards from "@/pages/Users/Buyer/Deals/DealsOverviewCards";

interface DealsListProps {
    deals: PropertyDetail[];
}

export const DealsList = ({ deals }: DealsListProps) => {


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
