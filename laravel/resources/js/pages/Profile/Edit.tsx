import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types/pageProps';
import { Head } from '@inertiajs/react';

export default function Edit(props:PageProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            //todo must be done in feature
        </AuthenticatedLayout>
    );
}
