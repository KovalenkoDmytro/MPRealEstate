import {Head} from "@inertiajs/react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import {User, PropertyDetail} from "@/types";
import DealHeader from "@/Components/deal/DealHeader";
import PropertyDetails from "@/Components/deal/PropertyDetails";
import SellerInfo from "@/Components/deal/SellerInfo";
import DepositSection from "@/Components/deal/DepositSection";
import ConditionDayForm from "@/Components/deal/ConditionDayForm";
import PossessionDayForm from "@/Components/deal/PossessionDayForm";
import LawyerInvite from "@/Components/deal/LawyerInvite";
import FileUploadSection from "@/Components/deal/FileUploadSection";
import BreakDealSection from "@/Components/deal/BreakDealSection";


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

            <BreakDealSection deal={deal} authUser={auth.user}/>

        </AuthenticatedLayout>
    );
}
