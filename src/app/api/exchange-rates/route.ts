import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.EXCHANGE_RATES_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Exchange rates API key is missing" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      {
        cache: "force-cache",
        headers: { "Cache-Control": "max-age=600, stale-while-revalidate=300" },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Something went wrong",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
