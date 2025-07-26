import React from 'react';
import { Deal } from '@/types';
import { DealCard } from './DealCard';

interface DealsListProps {
    deals: Deal[];
}

export const DealsList: React.FC<DealsListProps> = ({ deals }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
            ))}
        </div>
    );
};
