import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

type DealProps = {
    deal: {
        id: number;
        name: string;
        amount: number;
        current_step: string;
        data: string;
        real_estate_listing: {
            id: number;
            title: string;
            description: string;
            location: string;
            price: number;
            bedrooms: number;
            bathrooms: number;
            square_feet: number;
            status: string;
            main_image?: { image_path: string };
            images?: { id: number; image_path: string }[];
        };
        users: Array<{
            id: number;
            name: string;
            email: string;
            role: string;
        }>;
    };
};

export default function DealShowPage({ deal }: DealProps) {
    // ✅ Find the seller in the users array
    const seller = deal.users.find(user => user.role === "seller");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Deal Details
                </h2>
            }
        >
            <Head title="Deal Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold">{deal.name}</h3>

                        <div className="mt-4">
                            <p className="text-lg">
                                💰 <strong>Amount:</strong> ${deal.amount.toLocaleString()}
                            </p>
                            <p className="text-lg">
                                🔄 <strong>Current Step:</strong> {deal.current_step}
                            </p>
                            <p className="text-lg">
                                📝 <strong>Description:</strong> {JSON.parse(deal.data).description}
                            </p>
                        </div>

                        {/* ✅ Real Estate Listing Info */}
                        <div className="mt-6 p-4 border rounded-md">
                            <h3 className="text-xl font-semibold">🏡 Property Details</h3>
                            {deal.real_estate_listing.main_image && (
                                <img
                                    src={deal.real_estate_listing.main_image.image_path}
                                    alt="Main Property Image"
                                    className="w-full h-64 object-cover rounded-lg shadow-md"
                                />
                            )}
                            <p><strong>Title:</strong> {deal.real_estate_listing.title}</p>
                            <p><strong>Description:</strong> {deal.real_estate_listing.description}</p>
                            <p><strong>Location:</strong> {deal.real_estate_listing.location}</p>
                            <p><strong>Price:</strong> ${deal.real_estate_listing.price.toLocaleString()}</p>
                            <p><strong>Bedrooms:</strong> {deal.real_estate_listing.bedrooms}</p>
                            <p><strong>Bathrooms:</strong> {deal.real_estate_listing.bathrooms}</p>
                            <p><strong>Size:</strong> {deal.real_estate_listing.square_feet} sqft</p>
                            <p><strong>Status:</strong> {deal.real_estate_listing.status}</p>

                            {/* ✅ Additional Images */}
                            {deal.real_estate_listing.images && deal.real_estate_listing.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {deal.real_estate_listing.images.map((img) => (
                                        <img
                                            key={img.id}
                                            src={img.image_path}
                                            alt="Property Gallery"
                                            className="h-24 w-full object-cover rounded-md"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ✅ Seller Details */}
                        {seller && (
                            <div className="mt-6 p-4 border rounded-md">
                                <h3 className="text-xl font-semibold">👤 Seller Information</h3>
                                <p><strong>Name:</strong> {seller.name}</p>
                                <p><strong>Email:</strong> {seller.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
