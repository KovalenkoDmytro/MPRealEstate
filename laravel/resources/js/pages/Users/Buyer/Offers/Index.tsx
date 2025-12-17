import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {Head} from "@inertiajs/react";
import {Offer} from "@/types";
import OffersGrid from "@/components/offers/OffersGrid/OffersGrid";


export default function DealIndexPage({ offers }: { offers: Offer[]}) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">📄 My Offers</h2>}
        >
            <Head title="My Offers" />

            <OffersGrid offers={offers} />
        </AuthenticatedLayout>
    );
}
