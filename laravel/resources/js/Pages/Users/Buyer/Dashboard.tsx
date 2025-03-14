import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

type Offer = {
    id: number;
    offer_price: number;
    message: string;
    status: string;
    listing: { id: number; title: string; price: number; seller: { name: string } };
};

type PageProps = {
    auth: { user: { role: string } };
    offers?: Offer[]; // Only available for buyers
};

export default function Dashboard() {
    const { auth, offers } = usePage<PageProps>().props;

    const isBuyer = auth.user.role === "buyer";

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in as <strong>{auth.user.role.toUpperCase()}!</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Buyer Offers Section (Only for Buyers) */}
            {isBuyer && (
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-white p-6 shadow-md rounded-lg">
                            <h2 className="text-2xl font-semibold">📜 My Offers</h2>

                            {offers && offers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {offers.map((offer) => (
                                        <div key={offer.id} className="border p-4 rounded-lg shadow-md">
                                            <h3 className="text-lg font-semibold">
                                                <Link href={`/listings/${offer.listing.id}`} className="text-blue-500">
                                                    {offer.listing.title}
                                                </Link>
                                            </h3>
                                            <p>💰 Listing Price: ${offer.listing.price.toLocaleString()}</p>
                                            <p>📌 Seller: {offer.listing.seller.name}</p>
                                            <p><strong>My Offer:</strong> ${offer.offer_price.toLocaleString()}</p>
                                            <p className="text-gray-600"><strong>Message:</strong> {offer.message}</p>

                                            {/* ✅ Offer Status */}
                                            <p className={`mt-2 font-semibold ${
                                                offer.status === 'accepted' ? 'text-green-500' :
                                                    offer.status === 'rejected' ? 'text-red-500' :
                                                        'text-yellow-500'
                                            }`}>
                                                Status: {offer.status.toUpperCase()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-600">No offers made yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
