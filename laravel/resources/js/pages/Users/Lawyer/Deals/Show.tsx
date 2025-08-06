import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {PropertyDetail} from "@/types";
import DealHeader from "@/components/deal/DealHeader";
import PropertyDetails from "@/components/deal/PropertyDetails";
import FileUploadSection from "@/components/deal/FileUploadSection";
import DealPersonInfo from "@/components/deal/DealPersonInfo";
import DealTimeline from "@/components/deal/lawyer/DealTimeline";



export default function Show({deal}: {deal: PropertyDetail})
{
    const seller = deal.users.find(user => user.role === "seller")!;
    const buyer = deal.users.find(user => user.role === "buyer")!;


    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Deal Details</h2>}
        >
            <Head title="Deal Details"/>
            <DealHeader deal={deal} />
            <PropertyDetails listing={deal.real_estate_listing} />
            <DealPersonInfo person={buyer} />
            <DealPersonInfo person={seller} />
            <DealTimeline deal={deal} />
            <FileUploadSection deal={deal} />
        </AuthenticatedLayout>
    );
}

