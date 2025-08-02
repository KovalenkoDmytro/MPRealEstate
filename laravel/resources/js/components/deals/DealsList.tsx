import React from 'react';
import {PropertyDetail} from '@/types';
import { DealCard } from './DealCard';

interface DealsListProps {
    deals: PropertyDetail[];
}

export const DealsList: React.FC<{ deals: PropertyDetail[] }> = ({ deals }) => {
    if (deals.length === 0) {
        return <p className="text-gray-600">No deals found.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
            ))}
        </div>
    );
};
