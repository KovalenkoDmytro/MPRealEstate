import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {Deal, User} from '@/types/pageProps';

export default function Dashboard({ auth, deals }: { auth : {user : User} , deals : Deal[] }) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard LAWYER
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in as <strong>LAWYER</strong>!<br />
                            Your unique lawyer number is: <b>{auth.user.lawyer_number}</b>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">📑 My Deals</h3>

                        {deals.length === 0 ? (
                            <p className="text-gray-500">No deals assigned yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {deals.map(deal => (
                                    <li key={deal.id} className="p-4 border rounded shadow-sm hover:shadow-md transition">
                                        {deal.is_broken ?  <h2 className="text-red-700">Deal has been broken</h2> : null}
                                        <h4 className="text-md font-semibold">{deal.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            🏠 {deal.real_estate_listing.title} — {deal.real_estate_listing.location}
                                        </p>
                                        <Link
                                            href={`/deals/${deal.id}`}
                                            className="text-blue-600 hover:underline mt-2 inline-block"
                                        >
                                            View Deal →
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
