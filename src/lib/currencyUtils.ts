export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>
): number =>
  (amount * (exchangeRates?.[toCurrency] || 1)) /
  (exchangeRates?.[fromCurrency] || 1);

export const formatCurrency = (
  amount: number,
  currencyCode: string,
  currencies: { code: string; symbol: string }[]
): string => {
  const currency = currencies.find((c) => c.code === currencyCode);
  return `${currency?.symbol}${amount.toFixed(2)}`;
};
