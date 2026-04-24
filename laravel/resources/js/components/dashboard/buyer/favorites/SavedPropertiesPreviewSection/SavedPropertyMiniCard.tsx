import { RealEstateListing } from '@/types';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import IconLocationMark from "@/icons/IconLocationMark";

type SavedListingMiniCardProps = {
    listing: RealEstateListing;
};

export default function SavedListingMiniCard({ listing }: SavedListingMiniCardProps) {
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'CAD', maximumFractionDigits: 0,
    }).format(listing.price);
    const formattedSqft = new Intl.NumberFormat('en-US').format(listing.square_feet);
    const detailUrl = typeof route === 'function'
        ? route("listings.show", listing.id)
        : `/listings/${listing.id}`;
    const mainImage = listing.main_image?.image_path || '/images/placeholder-house.jpg';
    const statusClass = listing.status === 'sold'
        ? '--sold'
        : listing.status === 'pending' ? '--pending' : '';

    return (
        <div className={`saved-listing-mini-card ${statusClass}`}>

            <div className="mini-card-image-wrapper">
                <img src={mainImage} alt={listing.title} />

                <div className="mini-card-badges">
                    <Badge text={listing.status} version="primary" />
                </div>
            </div>

            <div className="mini-card-content">
                <h3 className="mini-card-title">{listing.title}</h3>

                <div className="mini-card-address">
                    <IconLocationMark/>
                    {listing.street_number}, {listing.street_name}, {listing.city}, {listing.province}, {listing.postal_code}
                </div>

                <div className="mini-card-features">
                    <div className="feature-item">
                        <span>{listing.bedrooms}</span> Beds
                    </div>
                    <div className="feature-item">
                        <span>{listing.bathrooms}</span> Baths
                    </div>
                    <div className="feature-item">
                        <span>{formattedSqft}</span> sqft
                    </div>
                </div>

                <div className="mini-card-footer">
                    <div>
                        <span className="price-label">Price</span>
                        <div className="price-value">{formattedPrice}</div>
                    </div>


                    <Button
                        version="primary"
                        text="Details"
                        link={true}
                        href={detailUrl}
                    />
                </div>
            </div>
        </div>
    );
}
