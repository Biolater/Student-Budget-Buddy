const fetchExchangeRates = async () => {
  try {
    const response = await fetch(`/api/exchange-rates`, {
      next: { revalidate: 600 },
    });

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
