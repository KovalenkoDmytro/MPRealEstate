import {PropertyDetail} from '@/types';
import { DealCard } from './DealCard';
import {Stack} from "@mui/material";

interface DealsListProps {
    deals: PropertyDetail[];
}

export const DealsList = ({ deals } : DealsListProps) => {
    if (deals.length === 0) {
        return <p className="text-gray-600">No deals found.</p>;
    }

    return (
        <Stack spacing={2}>
            {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
            ))}
        </Stack>
    );
};
