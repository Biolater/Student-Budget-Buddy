const fetchExchangeRates = async (targetCurrency: string) => {
  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Target-Currency": targetCurrency,
      },
      next: { revalidate: 600 },
    };

    const response = await fetch(`/api/exchange-rates`, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data: { conversion_rates: Record<string, number> } =
      await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default fetchExchangeRates;
