import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';



export default function Index({ listings }: { listings: Array<{ id: number; title: string; price: number; }> }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My listings
                </h2>
            }
        >
            <Head title=" My listings" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Real Estate Listings</h1>
                <ul className="list-disc pl-5">
                    {listings.map((listing) => (
                        <li key={listing.id} className="mb-2">
                            <Link href={`/listings/${listing.id}`} className="text-blue-500">
                                {listing.title} - ${listing.price}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}
