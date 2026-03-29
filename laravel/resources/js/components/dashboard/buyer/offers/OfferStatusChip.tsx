import Badge from '@/components/common/Badge';
import { OfferStatus } from '@/types/offer';

type OfferStatusChipProps = {
    status: OfferStatus;
};

export default function OfferStatusChip({ status }: OfferStatusChipProps) {
    // Map the offer status to our Badge 'version' (color scheme)
    let version: 'neutral' | 'success' | 'warning' | 'error' = 'neutral';

    switch (status) {
        case OfferStatus.Accepted:
            version = 'success';
            break;
        case OfferStatus.Pending:
            version = 'warning';
            break;
        case OfferStatus.Rejected:
            version = 'error';
            break;
    }

    return (
        <div className="offer-status-chip">
            <Badge
                text={status.toUpperCase()}
                version={version}
            />
        </div>
    );
}
