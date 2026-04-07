"use client";

import { useState, useEffect } from "react";

interface TokenPrice {
  name: string;
  symbol: string;
  price: number;
  change: number;
}

function formatPrice(price: number) {
  if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
}

function formatChange(change: number) {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function useLivePrices() {
  const [tokens, setTokens] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setTokens(data);
      } catch {
        // non-critical
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, []);

  return { tokens, loading };
}

export function PriceTicker() {
  const { tokens, loading } = useLivePrices();

  if (loading || tokens.length === 0) {
    return (
      <div className="flex gap-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <span key={i} className="h-3 w-32 bg-surface-glass rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {tokens.map((t) => (
        <span key={t.symbol} className="text-[10px] font-mono text-muted-light whitespace-nowrap">
          [{t.symbol}] {formatPrice(t.price)}{" "}
          <span className={t.change >= 0 ? "text-secondary" : "text-danger"}>
            {formatChange(t.change)}
          </span>
        </span>
      ))}
    </div>
  );
}

export function PriceCards() {
  const { tokens, loading } = useLivePrices();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-surface-glass" />
              <div className="space-y-1">
                <div className="h-3 w-8 bg-surface-glass rounded" />
                <div className="h-2 w-12 bg-surface-glass rounded" />
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="h-3 w-14 bg-surface-glass rounded" />
              <div className="h-2 w-10 bg-surface-glass rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <div key={token.symbol} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-surface-glass flex items-center justify-center text-[10px] font-bold text-muted-light">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{token.symbol}</p>
              <p className="text-[10px] text-muted">{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-foreground font-mono">{formatPrice(token.price)}</p>
            <p className={`text-[10px] font-mono ${token.change >= 0 ? "text-secondary" : "text-danger"}`}>
              {formatChange(token.change)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
