import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import { PropertyDetail } from "@/types";
import DealHeader from "@/components/deal/DealHeader";
import DealPersonInfo from "@/components/deal/DealPersonInfo";
import LawyerInvite from "@/components/deal/LawyerInvite";
import FileUploadSection from "@/components/deal/FileUploadSection";
import BreakDealSection from "@/components/deal/BreakDealSection";
import DepositActions from "@/components/deal/seller/DepositActions";
import ConditionDayActions from "@/components/deal/seller/ConditionDayActions";
import PossessionDayActions from "@/components/deal/seller/PossessionDayActions";
import DealPropertyDetails from "@/components/deal/DealPropertyDetails";
import DealInactiveNotice from "@/components/deal/DealInactiveNotice";

export default function SellerDealShowPage({ deal }: { deal: PropertyDetail }) {
    const buyer = deal.users.find((user) => user.role === "buyer");
    const lawyer = deal.users.find((user) => user.role === "lawyer" && user.is_seller_lawyer);
    const isDealBroken = deal.is_broken;

    return (
        <AuthenticatedLayout header="Deal Details">
            {isDealBroken && <DealInactiveNotice deal={deal} />}

            <DealHeader deal={deal} />

            <DealPropertyDetails listing={deal.real_estate_listing} />

            {!isDealBroken && buyer && <DealPersonInfo person={buyer} />}

            {!isDealBroken && (
                <>
                    <DepositActions deal={deal} />
                    {deal.condition_day && <ConditionDayActions deal={deal} />}
                    {deal.possession_day && <PossessionDayActions deal={deal} />}
                    <LawyerInvite deal={deal} lawyer={lawyer} />
                    <FileUploadSection deal={deal} />
                    <BreakDealSection deal={deal} />
                </>
            )}
        </AuthenticatedLayout>
    );
}
