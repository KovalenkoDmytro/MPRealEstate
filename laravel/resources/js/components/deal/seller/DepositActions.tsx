import React from "react";
import { PropertyDetail } from "@/types";

export default function DepositActions({ deal }: { deal: PropertyDetail }) {
    if (!deal.is_made || deal.is_confirmed) return null;

    const confirmDeposit = async () => {
        if (!confirm("Confirm deposit received?")) return;
        await fetch(route("seller.deals.confirmDeposit", deal.id), {
            method: "POST",
            headers: { "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "" },
        });
        window.location.reload();
    };

    return (
        <div className="mt-6 p-4 border rounded-md bg-yellow-50">
            <h3 className="text-xl font-semibold text-yellow-700">🔒 Confirm Security Deposit</h3>
            <p className="mt-2 text-sm text-gray-700">
                The buyer has marked the security deposit as made. Please review the uploaded confirmation file and confirm.
            </p>
            <button
                onClick={confirmDeposit}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                ✅ Confirm Deposit
            </button>
        </div>
    );
}
