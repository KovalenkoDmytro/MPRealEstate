import React, { useState } from "react";
import { Deal } from "@/types";

export default function SetDepositForm({ deal }: { deal: Deal }) {
    const [deposit, setDeposit] = useState<string>("");

    // Only show if deposit is NOT set yet
    if (deal.security_deposit) {
        return (
            <p className="text-green-600 font-medium mt-4">
                Security deposit already set: ${deal.security_deposit}
            </p>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(route("seller.deals.setDeposit", deal.id), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                },
                body: JSON.stringify({ security_deposit: deposit }),
            });

            if (!response.ok) throw new Error("Failed to set deposit");

            alert("Deposit saved successfully!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving the deposit.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-md bg-gray-50">
            <label className="block text-sm font-medium mb-2">Set Security Deposit Amount</label>
            <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Enter deposit amount"
                required
            />
            <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Save Deposit
            </button>
        </form>
    );
}
