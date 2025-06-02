import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { Deal } from '@/types';

export default function BuyerDealsIndex({ deals }: { deals: Deal[] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">📄 My Deals</h2>}
        >
            <Head title="My Deals" />

            <div className="p-12">
                <h1 className="text-2xl font-bold mb-6">📄 My Deals</h1>

                {deals.length === 0 ? (
                    <p className="text-gray-600">You don't have any deals yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {deals.map((deal) => (
                            <div
                                key={deal.id}
                                className="border rounded-md p-4 shadow hover:shadow-md transition"
                            >
                                <h2 className="text-lg font-semibold">{deal.name}</h2>
                                <p className="text-gray-700">
                                    💰 <strong>Amount:</strong> ${deal.amount.toLocaleString()}
                                </p>
                                <p className="text-gray-600">
                                    🏡 <strong>Listing:</strong> {deal.real_estate_listing?.title}
                                </p>
                                {/*<p className="text-gray-600">*/}
                                {/*    🔄 <strong>Status:</strong> {deal.current_step}*/}
                                {/*</p>*/}

                                <Link
                                    href={route('deals.show', deal.id)}
                                    className="inline-block mt-2 text-blue-600 hover:underline"
                                >
                                    View Deal →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
