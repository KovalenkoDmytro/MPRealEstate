import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Deal } from '@/types';
import { DealsList } from '@/Components/deals/DealsList';

interface DealsIndexProps {
  deals: Deal[];
}

export const DealsIndex: React.FC<DealsIndexProps> = ({ deals }) => {
  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold text-gray-800">📄 My Deals</h2>}
    >
      <Head title="My Deals" />

      <div className="p-12">
        <h1 className="text-2xl font-bold mb-6">📄 My Deals</h1>

        {deals.length === 0 ? (
          <NoDealsMessage />
        ) : (
          <DealsList deals={deals} />
        )}
      </div>
    </AuthenticatedLayout>
  );
};

const NoDealsMessage: React.FC = () => (
  <p className="text-gray-600">You don't have any deals yet.</p>
);

export default DealsIndex;
