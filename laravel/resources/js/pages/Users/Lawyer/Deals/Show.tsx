import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {PropertyDetail} from "@/types";
import DealHeader from "@/components/deal/DealHeader";
import PropertyDetails from "@/components/deal/PropertyDetails";
import FileUploadSection from "@/components/deal/FileUploadSection";
import DealPersonInfo from "@/components/deal/DealPersonInfo";
import DealTimeline from "@/components/deal/lawyer/DealTimeline";
import {useAuth} from "@/hooks/useAuth";


export default function Show({deal}: {deal: PropertyDetail})
{
    const lawyer = useAuth();
    const seller = deal.users.find(user => user.role === "seller")!;
    const buyer = deal.users.find(user => user.role === "buyer")!;

    let otherLawyer
    if (lawyer.is_buyer_lawyer) {
        // I'm the buyer's lawyer, so get the seller's lawyer
        otherLawyer = deal.users.find(user => user.role === "lawyer" && user.is_seller_lawyer);
    } else if (lawyer.is_seller_lawyer) {
        // I'm the seller's lawyer, so get the buyer's lawyer
        otherLawyer = deal.users.find(user => user.role === "lawyer" && user.is_buyer_lawyer);
    }


    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Deal Details</h2>}
        >
            <Head title="Deal Details"/>
            <DealHeader deal={deal} />
            <PropertyDetails listing={deal.real_estate_listing} />
            <DealPersonInfo person={buyer} />
            <DealPersonInfo person={seller} />
            { otherLawyer &&  <DealPersonInfo person={otherLawyer} />}
            <DealTimeline deal={deal} />
            <FileUploadSection deal={deal} />
        </AuthenticatedLayout>
    );
}

