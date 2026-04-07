"use client";

import { TrendingUp, Flame, ArrowUpRight } from "lucide-react";

const TRENDING_TOKENS = [
  { name: "Bitcoin", symbol: "BTC", change: "+4.2%", up: true },
  { name: "Ethereum", symbol: "ETH", change: "+2.8%", up: true },
  { name: "Solana", symbol: "SOL", change: "+12.1%", up: true },
];

const TRENDING_TOPICS = [
  { tag: "#DeFiSummer", posts: 2340 },
  { tag: "#NFTDrop", posts: 1820 },
  { tag: "#Layer2", posts: 1560 },
  { tag: "#Airdrop", posts: 980 },
];

export default function TrendingSidebar() {
  return (
    <aside className="w-72 space-y-3">
      {/* Trending tokens */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-secondary" />
          <h3 className="text-xs font-semibold text-foreground">Trending</h3>
          <span className="text-[10px] text-muted ml-auto uppercase tracking-wider">24h</span>
        </div>
        <div className="space-y-2.5">
          {TRENDING_TOKENS.map((token) => (
            <div key={token.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-surface-glass flex items-center justify-center text-[9px] font-bold text-muted-light">
                  {token.symbol.slice(0, 2)}
                </div>
                <span className="text-xs text-foreground">{token.symbol}</span>
              </div>
              <span className={`text-[10px] font-mono ${token.up ? "text-secondary" : "text-danger"}`}>
                {token.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending topics */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-3.5 h-3.5 text-warning" />
          <h3 className="text-xs font-semibold text-foreground">Hot Topics</h3>
        </div>
        <div className="space-y-2">
          {TRENDING_TOPICS.map((topic) => (
            <div key={topic.tag} className="flex items-center justify-between group cursor-pointer py-1">
              <span className="text-xs text-muted-light group-hover:text-foreground transition-colors">
                {topic.tag}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-muted">
                <span>{topic.posts.toLocaleString()}</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X Integration */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-3.5 h-3.5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <h3 className="text-xs font-semibold text-foreground">From X</h3>
        </div>
        <p className="text-[10px] text-muted mb-3 leading-relaxed">
          Share posts to X or embed tweets in your discussions.
        </p>
        <button className="w-full text-[10px] text-center py-2 bg-surface-glass hover:bg-border-hover rounded-lg text-muted-light hover:text-foreground transition-all">
          Connect X handle
        </button>
      </div>
    </aside>
  );
}
