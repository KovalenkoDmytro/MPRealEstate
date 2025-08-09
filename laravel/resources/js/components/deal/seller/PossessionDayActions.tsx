import React from "react";
import { PropertyDetail } from "@/types";
import {DealService} from "@/services/dealService";

export default function PossessionDayActions({ deal }: { deal: PropertyDetail }) {
    if (!deal.possession_day || deal.is_possession_day_confirmed) return null;

    const confirmPossessionDay = async () => {
        if (!confirm("Confirm the buyer's proposed possession day?")) return;
        try {
            const response = await DealService.confirmPossessionDay(deal.id)

            if (response.ok) {
                alert(response.message);
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.message || "Failed to confirm possession day.");
            }
        } catch (err) {
            console.error(err);
            alert("Error confirming possession day.");
        }
    };

    return (
        <div className="mt-6 p-4 border rounded-md bg-yellow-50">
            <h3 className="text-lg font-semibold">📅 Confirm Possession Day</h3>
            <p>
                Buyer selected <strong>{new Date(deal.possession_day).toLocaleDateString()}</strong> as the possession day.
            </p>
            <button
                onClick={confirmPossessionDay}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                ✅ Confirm Possession Day
            </button>
        </div>
    );
}
