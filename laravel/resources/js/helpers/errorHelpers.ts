/**
 * Extracts a human-readable message from a Laravel error response.
 *
 * Supports:
 * - Laravel validation errors: { field: ["msg1", "msg2"] }
 * - Generic Laravel error messages
 * - Fallback unknown errors
 */
export const extractErrorMessage = (res: any): string => {
    try {
        const errors = res?.data?.errors;

        // Laravel validation errors ONLY if not empty
        if (errors && Object.keys(errors).length > 0) {
            return Object.values(errors)
                .flat()
                .join("\n");
        }

        // Single generic error message
        if (res?.data?.message) {
            return res.data.message;
        }

        // Axios message
        if (res?.message) {
            return res.message;
        }

        return "Something went wrong. Please try again.";
    } catch {
        return "Unexpected error occurred.";
    }
};
