import React from 'react';
import { RealEstateListing } from '@/types';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

type SavedListingMiniCardProps = {
    listing: RealEstateListing;
};

export default function SavedListingMiniCard({ listing }: SavedListingMiniCardProps) {
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'CAD', maximumFractionDigits: 0,
    }).format(listing.price);
    const formattedSqft = new Intl.NumberFormat('en-US').format(listing.square_feet);
    const detailUrl = typeof route === 'function'
        ? route("buyer.listings.show", listing.id)
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {listing.location}
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
