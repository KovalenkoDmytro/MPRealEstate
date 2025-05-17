import {Head, useForm, Link, useForm as useFormInvite} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import type { Deal } from "@/types"; // or wherever DealProps is defined
import type { User } from "@/types"; // adjust if your User type is elsewhere
import {filterFilesForUser} from "@/Helpers/fileHelpers";

export default function DealShowPage({deal, auth}: {deal: Deal, auth: {user: User}}) {
    // ✅ Find the seller in the users array
    const roles = Object.fromEntries(
        deal.users.map(user => [user.role, user])
    );

    const seller = roles.seller;
    const buyer = roles.buyer;
    const lawyer = roles.lawyer;


    // ✅ File Upload Handling
    const { data, setData, post, progress } = useForm({ file: null as File | null });
    const [uploadedFiles, setUploadedFiles] = useState(filterFilesForUser(deal.files || [], auth.user, deal.users)); // ✅ Default to empty array if null
    const [isFileSelected, setIsFileSelected] = useState(false); // ✅ Track if file is chosen

    const [deposit, setDeposit] = useState<number | ''>(deal.security_deposit ?? '');
    const [savingDeposit, setSavingDeposit] = useState(false);


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

    const handleDepositSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingDeposit(true);

        try {
            const response = await fetch(`/deals/${deal.id}/set-deposit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ security_deposit: deposit }),
            });

            if (!response.ok) throw new Error('Failed to set deposit');

            const result = await response.json();
            alert('Deposit saved successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while saving the deposit.');
        } finally {
            setSavingDeposit(false);
        }
    };


    const inviteForm = useForm({lawyer_code: ''});
    const handleLawyerInvite = (e: React.FormEvent) => {
        e.preventDefault();

        fetch(`/deals/${deal.id}/invite-lawyer`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inviteForm.data),
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    alert("❌ " + data.message);
                    return;
                }

                alert("✅ " + data.message);
            })
            .catch(() => alert("An error occurred."));
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

                        {deal.is_made && !deal.is_confirmed && (
                            <div className="mb-6 p-4 border-l-4 border-yellow-400 bg-yellow-100 text-yellow-800 rounded">
                                ⚠️ The buyer has made the security deposit. Please review the uploaded confirmation file and confirm receiving it.
                            </div>
                        )}

                        {deal.is_made && deal.is_confirmed && (
                            <div className="mb-6 p-4 border-l-4 border-green-400 bg-green-100 text-green-800 rounded">
                                ✅ You security deposit has been recived.
                            </div>
                        )}

                        {/* ✅ Seller Confirmation Section */}
                        {!deal.is_confirmed && deal.is_made && (
                            <div className="mt-6 p-4 border rounded-md bg-yellow-50">
                                <h3 className="text-xl font-semibold text-yellow-700">🔒 Confirm Security Deposit</h3>
                                <p className="mt-2 text-sm text-gray-700">
                                    The buyer has marked the security deposit as made. Please review the uploaded confirmation file and confirm.
                                </p>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        fetch(`/deals/${deal.id}/confirm-deposit`, {
                                            method: 'POST',
                                            headers: {
                                                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "",
                                                "Content-Type": "application/json",
                                            },
                                        })
                                            .then((response) => response.json())
                                            .then((data) => {alert(response.message)});
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        ✅ Confirm Deposit
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ✅ Already Confirmed */}
                        {deal.is_confirmed && (
                            <div className="mt-6 p-4 border rounded-md bg-green-50 text-green-700">
                                ✅ Security deposit has been confirmed.
                            </div>
                        )}


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

                        {/* ✅ Buyer Details */}
                        {buyer && (
                            <div className="mt-6 p-4 border rounded-md">
                                <h3 className="text-xl font-semibold">👤 Buyer Information</h3>
                                <p><strong>Name:</strong> {buyer.name}</p>
                                <p><strong>Email:</strong> {buyer.email}</p>
                            </div>
                        )}

                        {/*/!* ✅ Lawyer Details *!/*/}
                        {/*<div className="mt-6 p-4 border rounded-md">*/}
                        {/*    <h3 className="text-xl font-semibold">👤 Lawyer Information</h3>*/}
                        {/*    {lawyer ? (*/}
                        {/*        <>*/}
                        {/*            <p><strong>Name:</strong> {lawyer.name}</p>*/}
                        {/*            <p><strong>Email:</strong> {lawyer.email}</p>*/}
                        {/*        </>*/}
                        {/*    ) : (*/}
                        {/*        <p>Didn’t participate yet</p>*/}
                        {/*    )}*/}
                        {/*</div>*/}

                         ✅ Inviting lawyer
                        {lawyer && lawyer.is_seller_lawyer ? (
                            <div className="mt-6 p-4 border rounded-md bg-green-50 text-green-700">
                                <h3 className="text-xl font-semibold">📩 Your Lawyer</h3>
                                <p><strong>Name:</strong> {lawyer.name}</p>
                                <p><strong>Email:</strong> {lawyer.email}</p>
                                <p><strong>Lawyer Code:</strong> {lawyer.lawyer_number || 'N/A'}</p>
                            </div>
                        ) : (
                            <div className="mt-6 p-4 border rounded-md">
                                <h3 className="text-xl font-semibold">📩 Invite a Lawyer</h3>
                                <form onSubmit={handleLawyerInvite} className="flex flex-col sm:flex-row gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={inviteForm.data.lawyer_code}
                                        onChange={(e) => inviteForm.setData('lawyer_code', e.target.value)}
                                        placeholder="Enter 9-character lawyer code"
                                        className="border p-2 rounded w-full sm:w-72"
                                        maxLength={9}
                                        pattern="[A-Za-z0-9]{9}"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Invite
                                    </button>
                                </form>
                            </div>
                        )}


                        {/* ✅ Security Deposit Section */}
                        {deal.security_deposit ? (
                            <p className="text-green-600 font-medium">Security deposit already set: ${deal.security_deposit}</p>
                        ) : (
                            <form onSubmit={handleDepositSubmit}>
                                <input
                                    type="number"
                                    name="security_deposit"
                                    onChange={(e) => setDeposit(Number(e.target.value))}
                                    className="border p-2 rounded w-full"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Set Security Deposit
                                </button>
                            </form>
                        )}

                        {/* ✅ condition day Section */}
                        {deal.condition_day && !deal.is_condition_day_confirmed && (
                            <div className="mt-6 p-4 border rounded-md bg-yellow-50 text-yellow-800">
                                <h3 className="text-lg font-semibold">📅 Confirm Condition Day</h3>
                                <p>
                                    Buyer selected <strong>{new Date(deal.condition_day).toLocaleDateString()}</strong> as the condition day.
                                </p>
                                <button
                                    onClick={() => {
                                        fetch(`/deals/${deal.id}/confirm-condition-day`, {
                                            method: 'PATCH',
                                            headers: {
                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                'Content-Type': 'application/json',
                                            },
                                        })
                                            .then(res => res.json())
                                            .then(() => {
                                                alert('You have confirmed the condition day.');
                                                location.reload(); // or update state manually
                                            });
                                    }}
                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    ✅ Confirm Condition Day
                                </button>
                            </div>
                        )}

                        {deal.condition_day && deal.is_condition_day_confirmed && (
                            <div className="mt-6 p-4 border rounded-md bg-green-50 text-green-700">
                                ✅ You have confirmed the condition day:
                                <strong> {new Date(deal.condition_day).toLocaleDateString()}</strong>
                            </div>
                        )}


                        {/* ✅ possession day Section */}
                        {deal.possession_day && !deal.is_possession_day_confirmed && (
                            <div className="mt-6 p-4 border rounded-md bg-yellow-50 text-yellow-800">
                                <h3 className="text-lg font-semibold">📅 Confirm possession Day</h3>
                                <p>
                                    Buyer selected <strong>{new Date(deal.possession_day).toLocaleDateString()}</strong> as the possession day.
                                </p>
                                <button
                                    onClick={() => {
                                        fetch(`/deals/${deal.id}/confirm-possession-day`, {
                                            method: 'PATCH',
                                            headers: {
                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                'Content-Type': 'application/json',
                                            },
                                        })
                                            .then(res => res.json())
                                            .then(() => {
                                                alert('You have confirmed the possession day.');
                                                location.reload(); // or update state manually
                                            });
                                    }}
                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    ✅ Confirm possession Day
                                </button>
                            </div>
                        )}

                        {deal.possession_day && deal.is_possession_day_confirmed && (
                            <div className="mt-6 p-4 border rounded-md bg-green-50 text-green-700">
                                ✅ You have confirmed the possession day:
                                <strong> {new Date(deal.possession_day).toLocaleDateString()}</strong>
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
                                <ul className="list-disc pl-5 space-y-2">
                                    {uploadedFiles.map((file) => (
                                        <li key={file.id} className="flex justify-between items-start flex-col sm:flex-row sm:items-center sm:space-x-4">
                                            <div>
                                                <button
                                                    onClick={() => downloadFile(file.id)}
                                                    className="text-blue-500 underline"
                                                >
                                                    {file.file_name} ⬇️
                                                </button>
                                                {file.created_at && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Uploaded on: {new Date(file.created_at).toLocaleString()} by {file.author_name} ({file.author_email})
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(file.id)}
                                                className="text-red-500 mt-2 sm:mt-0"
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
