import { NextResponse } from "next/server";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true";

let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 60_000; // 1 minute

export async function GET() {
  try {
    // Return cached data if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.data);
    }

    const res = await fetch(COINGECKO_URL, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      // Return stale cache if API fails
      if (cache) return NextResponse.json(cache.data);
      throw new Error(`CoinGecko returned ${res.status}`);
    }

    const raw = await res.json();

    const data = [
      {
        name: "Bitcoin",
        symbol: "BTC",
        price: raw.bitcoin.usd,
        change: raw.bitcoin.usd_24h_change,
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        price: raw.ethereum.usd,
        change: raw.ethereum.usd_24h_change,
      },
      {
        name: "Solana",
        symbol: "SOL",
        price: raw.solana.usd,
        change: raw.solana.usd_24h_change,
      },
    ];

    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 502 }
    );
  }
}
