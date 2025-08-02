import React from 'react';
import {Head} from '@inertiajs/react';
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {PropertyDetail} from '@/types';
import {DealsList} from '@/components/deals/DealsList';

interface DealsIndexProps {
    deals: PropertyDetail[];
}

export default function DealsIndex({ deals }: DealsIndexProps)  {
    return (
        <AuthenticatedLayout
            header={<h1 className="text-xl font-semibold text-gray-800">📄 My Deals</h1>}
        >
            <Head title="My Deals"/>

            <DealsList deals={deals} />


        </AuthenticatedLayout>
    );
};

const NoDealsMessage: React.FC = () => (
    <p className="text-gray-600">You don't have any deals yet.</p>
);
