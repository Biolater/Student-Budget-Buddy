const fetchExchangeRates = async () => {
  try {
    const response = await fetch(`/api/exchange-rates`);
    const data: { conversion_rates: Record<string, number> } =
      await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default fetchExchangeRates;
