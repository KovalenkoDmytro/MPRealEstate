import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {PropertyDetail, User} from '@/types';
import {DealsList} from "@/components/deals/DealsList";

export default function Dashboard({ auth, deals }: { auth : {user : User} , deals : PropertyDetail[] }) {

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard LAWYER</h2>}
        >
            <Head title="Dashboard" />

            <div className="p-6 text-gray-900">
                You're logged in as <strong>LAWYER</strong>!<br />
                Your unique lawyer number is: <b>{auth.user.lawyer_number}</b>
            </div>

            <DealsList deals={deals} />
        </AuthenticatedLayout>
    );
}
