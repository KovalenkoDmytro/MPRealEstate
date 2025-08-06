import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {User, PropertyDetail} from "@/types";
import DealHeader from "@/components/deal/DealHeader";
import PropertyDetails from "@/components/deal/PropertyDetails";
import SellerInfo from "@/components/deal/SellerInfo";
import DepositSection from "@/components/deal/DepositSection";
import ConditionDayForm from "@/components/deal/ConditionDayForm";
import PossessionDayForm from "@/components/deal/PossessionDayForm";
import LawyerInvite from "@/components/deal/LawyerInvite";
import FileUploadSection from "@/components/deal/FileUploadSection";
import BreakDealSection from "@/components/deal/BreakDealSection";


export default function DealShowPage({deal, auth}: { deal: PropertyDetail; auth: { user: User } }) {
    const seller = deal.users.find((user) => user.role === "seller");
    const lawyer = deal.users.find((user) => user.role === "lawyer");

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Deal Details</h2>}>
            <Head title="Deal Details"/>


            <DealHeader deal={deal}/>

            <PropertyDetails listing={deal.real_estate_listing}/>

            {seller && <SellerInfo seller={seller}/>}

            <DepositSection deal={deal}/>

            <ConditionDayForm deal={deal}/>

            <PossessionDayForm deal={deal}/>

            <LawyerInvite deal={deal} lawyer={lawyer}/>

            <FileUploadSection deal={deal} user={auth.user}/>

            <BreakDealSection deal={deal}/>

        </AuthenticatedLayout>
    );
}
