import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {Offer} from "@/types";
import OffersGrid from "@/components/offers/OffersGrid";


export default function Dashboard({ offers }: {offers: Offer[]}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashbord
                </h2>
            }
        >
            <Head title="Dashbord" />
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <h2 className="text-xl mt-4 font-semibold">Pending Offers</h2>

            <OffersGrid
                offers={offers}
                variant="seller"
                filterStatus="pending"
            />


            <div className="mt-6">
                <Link href={route('seller.listings.index')} className="text-blue-500">View My Listings</Link>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
