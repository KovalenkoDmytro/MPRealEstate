import React from 'react';
import { Link } from '@inertiajs/react';
import type { Listing } from '@/types/pageProps';

export const ListingDetails = ({ listing }: { listing: Listing }) => (
  <div className="mt-6">
    <h1 className="text-2xl font-bold">{listing.title}</h1>
    <p className="text-lg">Price: <strong>${listing.price.toLocaleString()}</strong></p>
    <p className="text-lg">Location: {listing.location}</p>
    <p className="text-lg">Type: {listing.property_type || 'N/A'}</p>
    <p className="text-lg">Bedrooms: {listing.bedrooms}</p>
    <p className="text-lg">Bathrooms: {listing.bathrooms}</p>
    <p className="text-lg">Square Feet: {listing.square_feet}</p>
    <p className="text-lg">Lot Size: {listing.lot_size ?? 'N/A'}</p>
    <p className="text-lg">Year Built: {listing.year_built ?? 'N/A'}</p>
    <div className="mt-4">
      <Link href={route('buyer.listings.index')} className="text-blue-500">
        Back to Listings
      </Link>
    </div>
  </div>
);
