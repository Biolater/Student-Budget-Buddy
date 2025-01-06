import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.EXCHANGE_RATES_API_KEY;
  if (!apiKey) {
    throw new Error("Exchange rates API key is missing");
  }

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
  );
  const data = await response.json();
  return new Response(JSON.stringify(data));
}
