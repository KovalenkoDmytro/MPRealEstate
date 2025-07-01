// import { Head, Link } from "@inertiajs/react";
// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
//
// type Listing = {
//     id: number;
//     title: string;
//     price: number;
//     location: string;
//     main_image: { image_path: string } | null;
// };
//
// export default function Index({ listings }: { listings: Listing[] }) {
//     return (
//         <AuthenticatedLayout
//             header={
//                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
//                     My Listings
//                 </h2>
//             }
//         >
//             <Head title="My Listings" />
//
//             <div className="container mx-auto p-4">
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="text-2xl font-bold">🏡 My Real Estate Listings</h1>
//                     <Link
//                         href={"/listing/create"}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
//                     >
//                         ➕ Add New Listing
//                     </Link>
//                 </div>
//
//                 {listings.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {listings.map((listing) => (
//                             <div
//                                 key={listing.id}
//                                 className="border rounded-lg shadow-md overflow-hidden"
//                             >
//                                 {/* ✅ Show Main Image if Available */}
//                                 {listing.main_image ? (
//                                     <img
//                                         src={listing.main_image.image_path}
//                                         alt={listing.title}
//                                         className="w-full h-48 object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
//                                         ❌ No Image Available
//                                     </div>
//                                 )}
//
//                                 <div className="p-4">
//                                     <h2 className="text-xl font-bold">{listing.title}</h2>
//                                     <p className="text-gray-600">📍 {listing.location}</p>
//                                     <p className="text-lg font-semibold">
//                                         💰 ${listing.price.toLocaleString()}
//                                     </p>
//
//                                     <Link
//                                         href={`/listings/${listing.id}`}
//                                         className="block text-blue-500 mt-2"
//                                     >
//                                         🔍 View Details
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-gray-500">No listings found. Add a new one!</p>
//                 )}
//             </div>
//         </AuthenticatedLayout>
//     );
// }
