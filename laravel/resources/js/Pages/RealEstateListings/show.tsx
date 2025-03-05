import { Link } from "@inertiajs/react";

type ListingProps = {
    listing: {
        id: number;
        title: string;
        description: string;
        price: number;
        location: string;
        bedrooms: number;
        bathrooms: number;
        square_feet: number;
        status: string;
        seller: { name: string };
    };
};

export default function Show({ listing }: ListingProps) {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-lg">Price: <strong>${listing.price}</strong></p>
            <p className="text-lg">Location: {listing.location}</p>
            <p className="text-lg">Bedrooms: {listing.bedrooms}</p>
            <p className="text-lg">Bathrooms: {listing.bathrooms}</p>
            <p className="text-lg">Listed by: {listing.seller.name}</p>

            <div className="mt-4">
                <Link href="/listings" className="text-blue-500">Back to Listings</Link>
            </div>
        </div>
    );
}
