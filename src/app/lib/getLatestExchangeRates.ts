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
    console.log("Requesting exchange rates from URL:", apiUrl); // Log the final API URL

    const response = await fetch(apiUrl);

    // Log response status and headers for more context
    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    if (!response.ok) {
      // Try to get the error message from the response body for a more detailed error
      const errorBody = await response.text();
      console.error("Error Body:", errorBody); // Log the error body (e.g., unauthorized message)

      // Throw an error with status and the body of the response for more details
      throw new Error(
        `Failed to fetch exchange rates from getLatestExchangeRates: ${response.statusText}. Response: ${errorBody}`
      );
    }

    const data: { conversion_rates: Record<string, number> } =
      await response.json();
    return data;
  } catch (error) {
    console.error("Error occurred:", error); // Log the caught error
    throw error;
  }
};

export default fetchExchangeRates;