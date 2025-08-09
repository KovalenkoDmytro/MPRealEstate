export const DealService = {
    // async setDeposit(dealId: number, securityDeposit: number) {
    //     return await fetchWithCsrf(`/deals/${dealId}/security-deposit`, {
    //         method: "POST",
    //         body: JSON.stringify({ security_deposit: securityDeposit }),
    //     });
    // },

    // async markDepositMade(dealId: number, time: Date ) {
    //     return await fetchWithCsrf(`/buyer/deals/${dealId}/make-deposit`, {
    //         method: "PATCH",
    //         body: JSON.stringify({
    //             is_security_deposit_made: true,
    //             security_deposit_made_at: time,
    //         }),
    //     });
    // },

    async confirmDeposit(dealId: number, depositDateTime : Date) {
        return await fetchWithCsrf(`/seller/deals/${dealId}/confirm-deposit`, {
            method: "PATCH",
            body: JSON.stringify({
                is_security_deposit_confirmed: true,
                security_deposit_confirmed_at: depositDateTime,
            }),
        });
    },

    async setConditionDay(dealId: number, conditionDay: string) {
        return await fetchWithCsrf(`/buyer/deals/${dealId}/set-condition-day`, {
            method: "PATCH",
            body: JSON.stringify({ condition_day: conditionDay }),
        });
    },

    // async confirmConditionDay(dealId: number) {
    //     return await fetchWithCsrf(`/deals/${dealId}/confirm-condition-day`, {
    //         method: "PATCH",
    //     });
    // },

    async setPossessionDay(dealId: number, possessionDay: string) {
        return await fetchWithCsrf(`/buyer/deals/${dealId}/set-possession-day`, {
            method: "PATCH",
            body: JSON.stringify({ possession_day: possessionDay }),
        });
    },

    // async confirmPossessionDay(dealId: number) {
    //     return await fetchWithCsrf(`/deals/${dealId}/confirm-possession-day`, {
    //         method: "PATCH",
    //     });
    // },

    async inviteLawyer(dealId: number, lawyerCode: string) {
        return await fetchWithCsrf(`/deals/${dealId}/invite-lawyer`, {
            method: "POST",
            body: JSON.stringify({ lawyer_code: lawyerCode }),
        });
    },

    async breakDeal(dealId: number, message: string) {
        return await fetchWithCsrf(`/deals/${dealId}/break-deal`, {
            method: "POST",
            body: JSON.stringify({ message }),
        });
    },

    async respondToBreakRequest(dealId: number, response: "approved" | "rejected") {
        return await fetchWithCsrf(`/deals/${dealId}/break-response`, {
            method: "POST",
            body: JSON.stringify({ response }),
        });
    },
};

// Utility function to handle CSRF-enabled fetch requests
async function fetchWithCsrf(url: string, options: RequestInit) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    const headers = {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {}),
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
    }

    return response.json();
}
