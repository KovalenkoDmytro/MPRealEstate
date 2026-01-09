import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import {PropertyDetail} from '@/types'
import {DealsList} from "@/components/deals/DealsList";

interface DealsIndexProps {
    deals: PropertyDetail[];
}
export default function DealIndexPage({ deals }: DealsIndexProps) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">📄 My Deals</h2>}
        >
            <Head title="My Deals" />

            <DealsList deals={deals} />

        </AuthenticatedLayout>
    );
}
