import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { PropertyDetail } from "@/types";
import DealHeader from "@/components/deal/DealHeader";
import PropertyDetails from "@/components/deal/PropertyDetails";
import SellerInfo from "@/components/deal/SellerInfo";
import DepositSection from "@/components/deal/DepositSection";
import LawyerInvite from "@/components/deal/LawyerInvite";
import FileUploadSection from "@/components/deal/FileUploadSection";
import BreakDealSection from "@/components/deal/BreakDealSection";
import DepositActions from "@/components/deal/seller/DepositActions";
import ConditionDayActions from "@/components/deal/seller/ConditionDayActions";
import PossessionDayActions from "@/components/deal/seller/PossessionDayActions";
import SetDepositForm from "@/components/deal/seller/SetDepositForm";

export default function SellerDealShowPage({ deal }: { deal: PropertyDetail;}) {

    const buyer = deal.users.find((user) => user.role === "buyer");
    const lawyer = deal.users.find((user) => user.role === "lawyer");

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Deal Details</h2>}>
            <Head title="Deal Details" />

            <DealHeader deal={deal} />

            <PropertyDetails listing={deal.real_estate_listing} />

            {buyer && <SellerInfo seller={buyer} />}

            <DepositSection deal={deal} />
            <SetDepositForm deal={deal} />
            <DepositActions deal={deal} />
            <ConditionDayActions deal={deal} />
            <PossessionDayActions deal={deal} />

            <LawyerInvite deal={deal} lawyer={lawyer} />

            <FileUploadSection deal={deal} />

            <BreakDealSection deal={deal}  />
        </AuthenticatedLayout>
    );
}
