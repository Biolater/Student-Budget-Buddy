import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY;
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
  );
  const data = await response.json();
  return new Response(JSON.stringify(data));
}
