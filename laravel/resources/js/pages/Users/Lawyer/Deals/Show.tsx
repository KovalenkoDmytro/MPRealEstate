import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { PropertyDetail } from "@/types";
import DealHeader from "@/components/deal/DealHeader";
import PropertyDetails from "@/components/deal/PropertyDetails";
import FileUploadSection from "@/components/deal/FileUploadSection";
import DealPersonInfo from "@/components/deal/DealPersonInfo";
import DealTimeline from "@/components/deal/lawyer/DealTimeline";
import { useAuth } from "@/hooks/useAuth";
import DealInactiveNotice from "@/components/deal/DealInactiveNotice";

export default function Show({ deal }: { deal: PropertyDetail }) {
    const lawyer = useAuth();
    const seller = deal.users.find((user) => user.role === "seller")!;
    const buyer = deal.users.find((user) => user.role === "buyer")!;
    const isDealBroken = deal.is_broken;

    let otherLawyer;
    if (lawyer.is_buyer_lawyer) {
        // I'm the buyer's lawyer, so get the seller's lawyer
        otherLawyer = deal.users.find((user) => user.role === "lawyer" && user.is_seller_lawyer);
    } else if (lawyer.is_seller_lawyer) {
        // I'm the seller's lawyer, so get the buyer's lawyer
        otherLawyer = deal.users.find((user) => user.role === "lawyer" && user.is_buyer_lawyer);
    }

    return (
        <AuthenticatedLayout
            header="Deal Details"
            title="Deal Details"
        >
            {isDealBroken && <DealInactiveNotice deal={deal} />}
            <DealHeader deal={deal} />



            <PropertyDetails listing={deal.real_estate_listing} />
            <DealPersonInfo person={buyer} />
            <DealPersonInfo person={seller} />
            {otherLawyer && <DealPersonInfo person={otherLawyer} />}
            <DealTimeline deal={deal} />
            {!isDealBroken && <FileUploadSection deal={deal} />}
        </AuthenticatedLayout>
    );
}
