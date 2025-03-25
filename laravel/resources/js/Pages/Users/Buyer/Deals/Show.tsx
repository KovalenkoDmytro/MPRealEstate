import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

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
        files?: {
            id: number;
            file_name: string;
            file_path: string;
        }[] | null;
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

    // ✅ File Upload Handling
    const { data, setData, post, progress } = useForm({ file: null as File | null });
    const [uploadedFiles, setUploadedFiles] = useState(deal.files || []); // ✅ Default to empty array if null
    const [isFileSelected, setIsFileSelected] = useState(false); // ✅ Track if file is chosen

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData("file", e.target.files[0]);
            setIsFileSelected(true); // ✅ Enable button when file is selected
        } else {
            setIsFileSelected(false); // ✅ Disable button if no file is selected
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/deals/${deal.id}/files`, {
            onSuccess: (res) => {
                if (res.props.flash.success) {
                    setUploadedFiles([...uploadedFiles, res.props.flash.file]); // Add new file
                    setIsFileSelected(false); // ✅ Reset button state
                }
            },
        });
    };

    const downloadFile = async (fileId: number) => {
        try {
            const response = await fetch(`/files/${fileId}/download`, { method: "GET" });

            if (!response.ok) {
                throw new Error("Failed to download file.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileId.toString(); // Filename can be dynamic
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleDelete = async (fileId: number) => {
        await fetch(`/files/${fileId}`, { method: "DELETE",  headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "",
                "Content-Type": "application/json",
            }, });

        // Remove file from state
        setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Deal Details</h2>}
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

                        {/* ✅ File Upload Section */}
                        <div className="mt-6 p-4 border rounded-md">
                            <h3 className="text-xl font-semibold">📂 Upload Deal Files</h3>
                            <form onSubmit={handleUpload} className="mt-2">
                                <input type="file" onChange={handleFileChange} className="border p-2 rounded w-full" />
                                {progress && <p>Uploading: {progress.percentage}%</p>}
                                <button type="submit"
                                        className={`mt-2 px-4 py-2 text-white rounded ${isFileSelected ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                                        disabled={!isFileSelected}>
                                    Upload File
                                </button>
                            </form>
                        </div>

                        {/* ✅ List Uploaded Files */}
                        {uploadedFiles.length > 0 && (
                            <div className="mt-6 p-4 border rounded-md">
                                <h3 className="text-xl font-semibold">📄 Deal Files</h3>
                                <ul className="list-disc pl-5">
                                    {uploadedFiles.map((file) => (
                                        <li key={file.id} className="flex justify-between items-center">
                                            <button
                                                onClick={() => downloadFile(file.id)}
                                                className="text-blue-500 underline"
                                            >
                                                {file.file_name} ⬇️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file.id)}
                                                className="text-red-500 ml-4"
                                            >
                                                ❌ Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
