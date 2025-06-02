import {Head, useForm, Link} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {useState} from "react";
import {useForm as useFormInvite} from '@inertiajs/react';
import type { Deal } from "@/types"; // or wherever DealProps is defined
import type { User } from "@/types"; // adjust if your User type is elsewhere
import {filterFilesForUser} from "@/Helpers/fileHelpers";

export default function DealShowPage({deal, auth}: {deal: Deal, auth: {user: User}}) {
    // ✅ Find the seller in the users array
    const seller = deal.users.find(user => user.role === "seller");

    // ✅ File Upload Handling
    const {data, setData, post, progress} = useForm({file: null as File | null});
    const [uploadedFiles, setUploadedFiles] = useState(filterFilesForUser(deal.files || [], auth.user, deal.users)); // ✅ Default to empty array if null
    const [isFileSelected, setIsFileSelected] = useState(false); // ✅ Track if file is chosen

    const [condition_day, setConditionDay] = useState(
        deal.condition_day ? deal.condition_day.slice(0, 10) : null
    );

    const [possession_day, setPossessionDay] = useState(
        deal.possession_day ? deal.possession_day.slice(0, 10) : null
    );
    // state for condition day
    console.log(deal.possession_day !== null, 'possession_day')

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
            const response = await fetch(`/files/${fileId}/download`, {method: "GET"});

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
        await fetch(`/files/${fileId}`, {
            method: "DELETE", headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "",
                "Content-Type": "application/json",
            },
        });

        // Remove file from state
        setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
    };


    const depositForm = useForm({confirmed: false});

    const handleDepositSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!depositForm.data.confirmed) return;

        depositForm.patch(route('deals.markDepositMade', deal.id), {
            preserveScroll: true,
            onSuccess: () => console.log("Deposit confirmed!"),
        });
    };


    const inviteForm = useFormInvite({lawyer_code: ''});
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

    const lawyer = deal.users.find(user=>user.role ==="lawyer")


    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Deal Details</h2>}
        >
            <Head title="Deal Details"/>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold">{deal.name}</h3>

                        <div className="mt-4">
                            <p className="text-lg">
                                💰 <strong>Amount:</strong> ${deal.amount.toLocaleString()}
                            </p>
                            {/*<p className="text-lg">*/}
                            {/*    🔄 <strong>Current Step:</strong> {deal.current_step}*/}
                            {/*</p>*/}
                            <p className="text-lg">
                                📝 <strong>Description:</strong> {JSON.parse(deal.data).description}
                            </p>
                            {deal.security_deposit && (
                                <p className="text-lg text-blue-700">
                                    🔐 <strong>Required Security
                                    Deposit:</strong> ${Number(deal.security_deposit).toLocaleString()}
                                </p>
                            )}
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

                        {/* ✅ Deposit Confirmation */}
                        {!deal.is_made && (
                            <div className="mt-6 p-4 border rounded-md">
                                <h3 className="text-xl font-semibold">💸 Security Deposit</h3>
                                <form onSubmit={handleDepositSubmit} className="space-y-3">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={depositForm.data.confirmed}
                                            onChange={e => depositForm.setData('confirmed', e.target.checked)}
                                            className="mr-2"
                                        />
                                        I confirm I have made the security deposit.
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={!depositForm.data.confirmed}
                                        className={`px-4 py-2 rounded text-white ${
                                            depositForm.data.confirmed ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Make Deposit
                                    </button>
                                </form>
                            </div>
                        )}

                        {deal.is_made && !deal.is_confirmed && (
                            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                                ⏳ Waiting for seller confirmation. Don’t forget to upload the confirmation file.
                            </div>
                        )}

                        {deal.is_confirmed && (
                            <div className="mt-6 p-4 border rounded-md bg-green-50 text-green-700">
                                ✅ You have made the security deposit, seller has confirmed it.
                            </div>
                        )}

                        //todo to check if is_confirmed is required here or should be something different option

                        {deal.is_confirmed && (
                            <div className="mt-6 p-4 border rounded-md bg-green-50 text-green-700">
                                <h3 className="text-lg font-semibold mb-2">✅ Seller has confirmed the security
                                    deposit.</h3>
                            </div>
                        )}


                        {/* ✅ condition_day */}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            fetch(`/deals/${deal.id}/set-condition-day`, {
                                method: 'PATCH',
                                headers: {
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({condition_day}),
                            }).then((res) => {
                                if (res.ok) {
                                    alert('✅ Condition day set successfully!');
                                    window.location.reload(); // Optional: refresh to show updated value
                                } else {
                                    alert('❌ Failed to set condition day.');
                                }
                            });
                        }}>
                            <label className="block text-sm font-medium text-green-800 mb-1">
                                📅 Select Condition Day:
                            </label>
                            <input
                                type="date"
                                value={condition_day !== null ? condition_day : ''}
                                onChange={(e) => setConditionDay(e.target.value)}
                                className={`border border-green-300 rounded p-2 text-black bg-white ${condition_day !== null ? 'cursor-not-allowed' : ''}`}
                                required
                                disabled={condition_day !== null}
                            />
                            <button
                                type="submit"
                                className={`ml-3 mt-2 px-4 py-2 rounded text-white ${deal.condition_day !== null ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                disabled={deal.condition_day !== null}
                            >
                                Select Condition Day
                            </button>
                        </form>


                        {/* ✅ possession_day */}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            fetch(`/deals/${deal.id}/set-possession-day`, {
                                method: 'PATCH',
                                headers: {
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({possession_day}),
                            }).then((res) => {
                                if (res.ok) {
                                    alert('✅ possession day set successfully!');
                                    window.location.reload();
                                } else {
                                    alert('❌ Failed to set possession  day.');
                                }
                            });
                        }}>
                            <label className="block text-sm font-medium text-green-800 mb-1">
                                📅 Select Possession Day:
                            </label>
                            <input
                                type="date"
                                value={possession_day !== null ? possession_day : ''}
                                onChange={(e) => setPossessionDay(e.target.value)}
                                className={`border border-green-300 rounded p-2 text-black bg-white ${possession_day !== null ? 'cursor-not-allowed' : ''}`}
                                required
                                disabled={possession_day !== null}
                            />
                            <button
                                type="submit"
                                className={`ml-3 mt-2 px-4 py-2 rounded text-white ${deal.possession_day !== null ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                disabled={deal.possession_day !== null}
                            >
                                Select Possession Day
                            </button>
                        </form>
                        {/* )} */}

                        {deal.condition_day ? (
                            !!deal.is_condition_day_confirmed ? (
                                <div className="mt-6 p-4 border rounded-md bg-green-50 text-green-700">
                                    ✅ Your selected condition day
                                    (<strong>{new Date(deal.condition_day).toLocaleDateString()}</strong>) has been
                                    approved by the seller.
                                </div>
                            ) : (
                                <div className="mt-6 p-4 border rounded-md bg-yellow-50 text-yellow-800">
                                    ⏳ The seller is still considering your selected condition day.
                                </div>
                            )
                        ) : null}




                        {/* ✅ Inviting lawyer */}
                        {lawyer && lawyer.is_buyer_lawyer ? (
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




                        {/* ✅ File Upload Section */}
                        <div className="mt-6 p-4 border rounded-md">
                            <h3 className="text-xl font-semibold">📂 Upload Deal Files</h3>
                            <form onSubmit={handleUpload} className="mt-2">
                                <input type="file" onChange={handleFileChange} className="border p-2 rounded w-full"/>
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
                                        <li key={file.id}
                                            className="flex justify-between items-start flex-col sm:flex-row sm:items-center sm:space-x-4">
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


//todo i want to add checkbox and calendar with date and time picker to set up - when buyer make deposit
