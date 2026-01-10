import React, { useState, useEffect, useRef } from 'react';
import { RealEstateListing } from '@/types';
import { listingService } from "@/services/listingService";
import { useNotification } from "@/context/NotificationContext";
import Button from '@/components/common/Button';
import Badge from "@/components/common/Badge";
import {formatCurrency} from "@/helpers/priceHelper";

type ListingCardProps = {
    listing: RealEstateListing;
    isFavorite: boolean;
    isDisplayStatus?: boolean;
    onRemove?: (id: number) => void;
};

export default function ListingCard({listing, isFavorite, isDisplayStatus = false, onRemove}: ListingCardProps) {
    console.log(listing)
    const { showNotification } = useNotification();
    const [isFav, setIsFav] = useState(isFavorite);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const previousState = isFav;
        const newState = !previousState;

        setIsFav(newState);
        setLoadingFavorite(true);

        if (!newState && onRemove) {
            onRemove(listing.id);
        }

        try {
            const response = await listingService.toggleFavorite(listing.id, previousState);

            if (isMounted.current) {
                if (response.data && typeof response.data.favorite === 'boolean') {
                    setIsFav(response.data.favorite);
                } else if (response.favorite !== undefined) {
                    setIsFav(response.favorite);
                }
            }
        } catch (error) {
            console.error("Failed to toggle favorite", error);

            if (isMounted.current) {
                setIsFav(previousState);
            }
            showNotification("Failed to update favorite. Please try again.", "error");
        } finally {
            if (isMounted.current) {
                setLoadingFavorite(false);
            }
        }
    };

    const formattedSqft = new Intl.NumberFormat('en-US').format(listing.square_feet);
    const detailUrl = typeof route === 'function' ? route("buyer.listings.show", listing.id) : `/listings/${listing.id}`;
    const mainImage = listing.main_image?.image_path || '/images/placeholder-house.jpg';

    return (
        <div className={`listing-card --${listing.status}`}>

            <div className="card-image-wrapper">
                <img className="card-image" src={mainImage} alt={listing.title} />

                {isDisplayStatus && (
                    <div className="card-badges">
                        <Badge text={listing.status} version={"primary"}/>
                    </div>
                )}

                <div className="card-actions">
                    <button
                        className="action-btn"
                        onClick={toggleFavorite}
                        disabled={loadingFavorite}
                        title={isFav ? "Remove from Favorites" : "Save to Favorites"}
                        style={{ color: isFav ? '#572a4d' : undefined }}
                    >
                        {isFav ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>


            <div className="card-content">
                <h3 className="card-title">{listing.title}</h3>
                <div className="card-address">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {listing.street_number}, {listing.street_name}, {listing.city}, {listing.province}, {listing.postal_code}
                </div>
                <div className="card-features">
                    <div className="feature-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M22 4v16M2 8h20M2 10h20M6 14v4M18 14v4"/></svg>
                        <span>{listing.bedrooms}</span> Beds
                    </div>
                    <div className="feature-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20v-6h6v6M4 20h16M2 8h20v12H2z"/></svg>
                        <span>{listing.bathrooms}</span> Baths
                    </div>
                    <div className="feature-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
                        <span>{formattedSqft}</span> sqft
                    </div>
                </div>
                <div className="card-footer">
                    <div>
                        <span className="price-label">Price</span>
                        <div className="price-value">{formatCurrency(listing.price)}</div>
                    </div>
                    <Button version="primary" text="View Details" link={true} href={detailUrl} />
                </div>
            </div>
        </div>
    );
}
