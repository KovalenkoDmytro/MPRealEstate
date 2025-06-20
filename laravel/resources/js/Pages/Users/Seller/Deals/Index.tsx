import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { Deal } from '@/types'


export default function DealIndexPage({ deals }: { deals: Deal[] }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">📄 My Deals</h2>}
        >
            <Head title="My Deals" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {deals.length > 0 ? (
                            <div className="space-y-4">
                                {deals.map((deal) => (
                                    <div
                                        key={deal.id}
                                        className="border p-4 rounded-md shadow-sm hover:shadow-md transition"
                                    >
                                        <h3 className="text-lg font-semibold text-blue-700">
                                            <Link href={`/deals/${deal.id}`}>{deal.name}</Link>
                                        </h3>
                                        <p><strong>💰 Amount:</strong> ${deal.amount.toLocaleString()}</p>
                                        {/*<p><strong>🔄 Step:</strong> {deal.current_step}</p>*/}
                                        <p><strong>📝 Description:</strong> {deal.seller_message}</p>
                                        <p className="text-sm text-gray-500">📅 Created: {new Date(deal.created_at).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No deals found.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
