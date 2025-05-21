/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | undefined | null, currency: string): string {
  // Map of currency codes to their symbols
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    AZN: "₼",
    // Add more currencies as needed
  };

  const symbol = currencySymbols[currency] || currency;
  
  // Handle undefined or null values
  if (amount === undefined || amount === null) {
    return `${symbol}0.00`;
  }

  return `${symbol}${amount.toFixed(2)}`;
}
