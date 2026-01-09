import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, type RealEstateListing } from '@/types';
import React, { useState } from "react";
import ListingCard from "@/components/listing_new/ListingCard";

// ----------------------------------------------------------------------
//  Main Page Component
// ----------------------------------------------------------------------

interface Props extends PageProps {
    favoriteListings: {
        data: RealEstateListing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
}

export default function ListingFavoritesPage({ favoriteListings }: Props) {
    const [localListings, setLocalListings] = useState<RealEstateListing[]>(favoriteListings.data);

    const handleRemoveItem = (id: number) => {
        setLocalListings((current) => current.filter(item => item.id !== id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Favorites</h2>}
        >
            <Head title="My Favorites" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Empty State */}
                    {localListings.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center text-gray-500">
                            <p className="text-lg mb-4">You haven't added any favorites yet.</p>
                            <Link
                                href={route('buyer.listings.favorites.index')}
                                className="text-indigo-600 hover:underline"
                            >
                                Browse Listings
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {localListings.map((listing) => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    isFavorite={true}
                                    isDisplayStatus={true}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {favoriteListings.data.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            {favoriteListings.links.map((link, key) => (
                                <Link
                                    key={key}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 border rounded mx-1 ${
                                        link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
