import React from "react";
import { PropertyDetail } from "@/types";

export default function ConditionDayActions({ deal }: { deal: PropertyDetail }) {
    if (!deal.condition_day || deal.is_condition_day_confirmed) return null;

    const confirmConditionDay = async () => {
        if (!confirm("Confirm the buyer's proposed condition day?")) return;
        try {
            const response = await fetch(route("seller.deals.confirmConditionDay", deal.id), {
                method: "PATCH",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                alert("Condition day confirmed.");
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.message || "Failed to confirm condition day.");
            }
        } catch (err) {
            console.error(err);
            alert("Error confirming condition day.");
        }
    };

    return (
        <div className="mt-6 p-4 border rounded-md bg-yellow-50">
            <h3 className="text-lg font-semibold">📅 Confirm Condition Day</h3>
            <p>
                Buyer selected <strong>{new Date(deal.condition_day).toLocaleDateString()}</strong> as the condition day.
            </p>
            <button
                onClick={confirmConditionDay}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                ✅ Confirm Condition Day
            </button>
        </div>
    );
}
