// lib/fetchExchangeRates.ts

const fetchExchangeRates = async (targetCurrency: string) => {
  if (!targetCurrency) {
    throw new Error("Target currency is missing");
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("Base URL is not defined");
    }

    const apiUrl = `${baseUrl}/api/exchange-rates?target-currency=${targetCurrency}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.EXCHANGE_RATES_API_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data: { conversion_rates: Record<string, number> } = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default fetchExchangeRates;
