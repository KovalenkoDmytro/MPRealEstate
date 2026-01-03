/**
 * Formats a number as a currency string (CAD).
 * Example: 1500000 -> "$1,500,000"
 *
 * @param amount - The numerical amount to format
 * @param currency - The currency code (default: 'CAD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'CAD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0, // Ensures we don't show .00 for house prices
    }).format(amount);
};

/**
 * Formats a number with commas.
 * Example: 2500 -> "2,500"
 *
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
};
