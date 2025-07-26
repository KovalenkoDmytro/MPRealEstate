import React from 'react';
import { Deal } from '@/types';
import { Link } from '@inertiajs/react';

interface DealCardProps {
    deal: Deal;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
    return (
        <div className="border rounded-md p-4 shadow hover:shadow-md transition">
            {deal.is_broken && (
                <h2 className="text-red-700 font-bold text-lg">
                    ❌ Deal has been broken
                </h2>
            )}

            <h2 className="text-lg font-semibold">{deal.name}</h2>
            <p className="text-gray-700">
                💰 <strong>Amount:</strong> ${deal.amount.toLocaleString()}
            </p>
            <p className="text-gray-600">
                🏡 <strong>Listing:</strong> {deal.real_estate_listing?.title ?? 'N/A'}
            </p>

            <Link
                href={route('deals.show', deal.id)}
                className="inline-block mt-2 text-blue-600 hover:underline"
            >
                View Deal →
            </Link>
        </div>
    );
};
