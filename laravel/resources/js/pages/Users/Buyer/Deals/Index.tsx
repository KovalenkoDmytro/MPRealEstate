import React from 'react';
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import {PropertyDetail} from '@/types';
import {DealsList} from '@/components/deals/DealsList';

interface DealsIndexProps {
    deals: PropertyDetail[];
}

export default function DealsIndex({ deals }: DealsIndexProps)  {

    console.log(deals)
    return (
        <AuthenticatedLayout
            header="My Deals"
        >
            <DealsList deals={deals} />
        </AuthenticatedLayout>
    );
};
