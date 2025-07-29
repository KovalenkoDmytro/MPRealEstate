// import { useMemo } from 'react';
// import {Link} from "@inertiajs/react";
// import type { Deal, User } from "@/types";
//
// export default function DealsPage({ deals }: { deals: Deal[] }) {
//     const memoizedDeals = useMemo(() => deals, [JSON.stringify(deals)]);
//
//     return (
//         <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg">
//             <h1 className="text-2xl font-bold text-gray-800 mb-4">Deals Overview</h1>
//             <table className="w-full border-collapse border border-gray-300">
//                 <thead>
//                 <tr className="bg-gray-200">
//                     <th className="border border-gray-300 px-4 py-2">ID</th>
//                     <th className="border border-gray-300 px-4 py-2">Name</th>
//                     <th className="border border-gray-300 px-4 py-2">Amount</th>
//                     <th className="border border-gray-300 px-4 py-2">Current Step</th>
//                     <th className="border border-gray-300 px-4 py-2">Users</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {memoizedDeals.map((deal: Deal & { users: User[] }) => (
//                     <tr key={deal.id} className="border border-gray-300 text-center">
//                         <td className="border border-gray-300 px-4 py-2">{deal.id}</td>
//                         <td className="border border-gray-300 px-4 py-2"><Link className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200" href={`/deals/${deal.id}`}> {deal.name}</Link></td>
//                         <td className="border border-gray-300 px-4 py-2">${deal.amount.toLocaleString()}</td>
//                         <td className="border border-gray-300 px-4 py-2">
//                             <ul className="text-left">
//                                 {deal.users.map((user) => (
//                                     <li key={user.id} className="text-sm">
//                                         {user.name} - <span className="text-gray-500">{user.role}</span>
//
//                                     </li>
//                                 ))}
//                             </ul>
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
