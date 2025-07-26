import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Offer} from "@/types/pageProps";


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

            {offers.length > 0 ? (
                offers
                    .filter((offer) => offer.status === 'pending')
                    .map((offer) => (
                    <div key={offer.id} className="border p-4 mt-2 rounded-md shadow-sm">
                        <p><strong>Listing:</strong> <Link href={route('seller.listings.show', offer.listing.id)} className="text-blue-500">{offer.listing.title}</Link> </p>
                        <p><strong>Buyer:</strong> {offer.buyer.name} ({offer.buyer.email})</p>
                        <p><strong>Offer Price:</strong> ${offer.offer_price}</p>
                        <p><strong>Message:</strong> {offer.message}</p>
                        <p><strong>Status:</strong> <span className="text-yellow-600">{offer.status}</span></p>
                    </div>
                ))
            ) : (
                <p className="mt-4 text-gray-500">No pending offers at the moment.</p>
            )}

            <div className="mt-6">
                <Link href={route('seller.listings.index')} className="text-blue-500">View My Listings</Link>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
