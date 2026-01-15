/**
 * Formats a value (number or string) as a currency string.
 * Handles float strings from databases and allows optional decimals.
 * * @param amount - The amount to format (number or string)
 * @param showDecimals - Whether to show cents (default: false for house prices)
 * @param currency - The currency code (default: 'USD' to match your images)
 */
export const formatCurrency = (
    amount: number | string,
    showDecimals: boolean = false,
    currency: string = 'USD'
): string => {
    const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericValue)) return '$0';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(numericValue);
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
