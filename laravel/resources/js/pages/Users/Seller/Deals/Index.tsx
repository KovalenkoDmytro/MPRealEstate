import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import {PropertyDetail} from '@/types'
import {DealsList} from "@/components/deals/DealsList";

interface DealsIndexProps {
    deals: PropertyDetail[];
}
export default function DealIndexPage({ deals }: DealsIndexProps) {
    return (
        <AuthenticatedLayout header="My Deals">
            <DealsList deals={deals} />
        </AuthenticatedLayout>
    );
}
