import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import {Head} from "@inertiajs/react";
import {Offer} from "@/types";
import OffersGrid from "@/components/offers/OffersGrid/OffersGrid";


export default function DealIndexPage({ offers }: { offers: Offer[]}) {
    return (
        <AuthenticatedLayout
            header="My Offers"
        >
            <OffersGrid offers={offers} />
        </AuthenticatedLayout>
    );
}
