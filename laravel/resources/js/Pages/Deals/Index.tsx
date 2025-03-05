import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DealsPage from "@/Pages/Deals/DealsTable";

export default function Index({deals} : {deals : []}) {


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Deals
                </h2>
            }
        >
            <Head title="Deals" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                           Deals
                        </div>

                        <DealsPage deals={deals} />
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
