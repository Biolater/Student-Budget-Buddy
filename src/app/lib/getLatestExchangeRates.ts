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

    // Dynamically construct the base URL
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" // Use the environment variable or fallback
        : ""; // Use relative URL on the client

    const response = await fetch(`${baseUrl}/api/exchange-rates`, options);

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
