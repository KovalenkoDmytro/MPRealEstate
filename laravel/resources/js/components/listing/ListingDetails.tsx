import React from 'react';
import { Link } from '@inertiajs/react';
import { RealEstateListing } from '@/types';

export const ListingDetails = ({ listing }: { listing: RealEstateListing }) => (
  <div className="mt-6">
    <h1 className="text-2xl font-bold">{listing.title}</h1>
    <p className="text-lg">Price: <strong>${listing.price.toLocaleString()}</strong></p>
    <p className="text-lg">Location: {listing.location}</p>
    <p className="text-lg">Type: {listing.property_type}</p>
    <p className="text-lg">Status: {listing.status}</p>
    <p className="text-lg">Bedrooms: {listing.bedrooms}</p>
    <p className="text-lg">Bathrooms: {listing.bathrooms}</p>
    <p className="text-lg">Square Feet: {listing.square_feet.toLocaleString()}</p>
    <p className="text-lg">Lot Size: {listing.lot_size ? `${listing.lot_size.toLocaleString()} sqft` : 'N/A'}</p>
    <p className="text-lg">Year Built: {listing.year_built ? listing.year_built : 'N/A'}</p>
    <p className="text-lg">Garage: {listing.has_garage ? `${listing.garage_spaces || 0} space(s)` : 'No'}</p>
    <p className="text-lg">Basement: {listing.has_basement ? 'Yes' : 'No'}</p>
    <p className="text-lg">HOA Fees: {listing.hoa_fees ? `$${listing.hoa_fees.toLocaleString()}` : 'N/A'}</p>
    <p className="text-lg">Property Taxes: {listing.property_taxes.toLocaleString()}</p>
    <p className="text-lg">Price Reduced: {listing.price_reduced ? 'Yes' : 'No'}</p>
    <p className="text-lg">Keywords: {listing.keywords || 'None'}</p>
    <div className="mt-4">
      <Link href={route('buyer.listings.index')} className="text-blue-500">
        Back to Listings
      </Link>
    </div>
  </div>
);
