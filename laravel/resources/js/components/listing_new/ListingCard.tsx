import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { PropertyStatus } from '@/types/realEstateListing';
import { RealEstateListing } from '@/types';
import { listingService } from "@/services/listingService";
import { useNotification } from "@/context/NotificationContext";
import Button from '@/components/common/Button';
import Badge from "@/components/common/Badge";
import {formatCurrency} from "@/helpers/priceHelper";
import IconLocationMark from "@/icons/IconLocationMark";
import IconBed from "@/icons/IconBed";
import IconBath from "@/icons/IconBath";
import IconSqft from "@/icons/IconSqft";
import { primary } from "@/design/tokens";

type ListingCardProps = {
    listing: RealEstateListing;
    isFavorite: boolean;
    isDisplayStatus?: boolean;
    onRemove?: (id: number) => void;
};

export default function ListingCard({listing, isFavorite, isDisplayStatus = true, onRemove}: ListingCardProps) {

    const { showNotification } = useNotification();
    const [isFav, setIsFav] = useState(isFavorite);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
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
        } catch {
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
    const detailUrl = typeof route === 'function' ? route("listings.show", listing.id) : `/listings/${listing.id}`;
    const mainImage = listing.main_image?.image_path || '/images/placeholder-house.jpg';

    return (
        <article className={`listing-card --${listing.status}`}>

            <div className="card-image-wrapper">
                <Link href={detailUrl} className="card-image-link" aria-label={`View ${listing.title}`}><img className="card-image" src={mainImage} alt={listing.title} loading="lazy" /></Link>

                {isDisplayStatus && (
                    <div className="card-badges">
                        <Badge text={listing.status} version={listing.status === PropertyStatus.Available ? 'success' : listing.status === PropertyStatus.Pending ? 'warning' : 'neutral'} size="small" />
                    </div>
                )}

                <div className="card-actions">
                    <button
                        className="action-btn"
                        type="button"
                        aria-pressed={isFav}
                        aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
                        onClick={toggleFavorite}
                        disabled={loadingFavorite}
                        title={isFav ? "Remove from Favorites" : "Save to Favorites"}
                        style={{ color: isFav ? primary[600] : undefined }}
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
                <h3 className="card-title"><Link href={detailUrl}>{listing.title}</Link></h3>
                <div className="card-address">
                    <IconLocationMark />
                    {[`${listing.street_number} ${listing.street_name}`.trim(), listing.city, listing.province].filter(Boolean).join(', ')}
                </div>
                <div className="card-features">
                    <div className="feature-item">
                       <IconBed/>
                        <span>{listing.bedrooms}</span> Beds
                    </div>
                    <div className="feature-item">
                        <IconBath/>
                        <span>{listing.bathrooms}</span> Baths
                    </div>
                    <div className="feature-item">
                        <IconSqft/>
                        <span>{formattedSqft}</span> sqft
                    </div>
                </div>
                <div className="card-footer">
                    <div>
                        <span className="price-label">Listing price</span>
                        <div className="price-value">{formatCurrency(listing.price)}</div>
                    </div>
                    <Button version="primary" icon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />} text="View details" link={true} href={detailUrl} fullWidth={false} />
                </div>
            </div>
        </article>
    );
}
