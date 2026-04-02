
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import {PropertyDetail} from "@/types";
import DealHeader from "@/components/deal/DealHeader";
import DealPersonInfo from "@/components/deal/DealPersonInfo";
import DepositSection from "@/components/deal/DepositSection";
import ConditionDayForm from "@/components/deal/ConditionDayForm";
import PossessionDayForm from "@/components/deal/PossessionDayForm";
import LawyerInvite from "@/components/deal/LawyerInvite";
import FileUploadSection from "@/components/deal/FileUploadSection";
import BreakDealSection from "@/components/deal/BreakDealSection";
import DealPropertyDetails from "@/components/deal/DealPropertyDetails";

export default function DealShowPage({deal}: { deal: PropertyDetail }) {
    const seller = deal.users.find((user) => user.role === "seller");
    const lawyer = deal.users.find((user) => user.role === "lawyer" && user.is_buyer_lawyer);

    return (
        <AuthenticatedLayout header="Deal Details">

            <DealHeader deal={deal}/>

            <DealPropertyDetails listing={deal.real_estate_listing}/>

            {seller && <DealPersonInfo person={seller}/>}















            {deal.security_deposit &&  <DepositSection deal={deal}/>}

            <ConditionDayForm deal={deal}/>

            {deal.condition_day &&  <PossessionDayForm deal={deal}/>}

            <LawyerInvite deal={deal} lawyer={lawyer}/>

            <FileUploadSection deal={deal}/>

            <BreakDealSection deal={deal}/>

        </AuthenticatedLayout>
    );
}
