export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Globe,
  MessageSquare,
  Rocket,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import LoomLogo from "@/components/LoomLogo";
import { PriceTicker, PriceCards } from "@/components/LivePrices";

export default async function Home() {
  // Fetch real data from the database
  const [communities, recentPosts, userCount, communityCount] = await Promise.all([
    prisma.community.findMany({
      include: { _count: { select: { members: true, posts: true } } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.post.findMany({
      include: {
        author: { select: { username: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.user.count(),
    prisma.community.count(),
  ]);

  const postCount = await prisma.post.count();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Ticker strip */}
      <div className="border-b border-border overflow-hidden py-2.5 bg-card/50">
        <div className="animate-ticker flex whitespace-nowrap">
          <PriceTicker />
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 glass-card-sm text-[11px] text-muted-light font-medium mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-soft" />
            {userCount > 0 ? `${userCount.toLocaleString()} members and growing` : "Live now — join the community"}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
            <span className="gradient-text">Where Crypto</span>
            <br />
            <span className="text-foreground">Culture Lives</span>
          </h1>

          <p className="text-muted text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Communities, real-time alpha, and crypto culture.
            All in one place.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/communities"
              className="flex items-center gap-2 px-6 py-2.5 glass-card-sm text-sm font-medium text-muted-light hover:text-foreground transition-colors"
            >
              Explore
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-min">

          {/* Communities List (2 cols) — real data or empty state */}
          <div className="glass-card bento-item p-5 lg:col-span-2 lg:row-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">Communities</h3>
              </div>
              <Link href="/communities" className="text-[10px] text-muted hover:text-muted-light transition-colors uppercase tracking-wider">
                View All
              </Link>
            </div>
            {communities.length > 0 ? (
              <div className="space-y-2">
                {communities.map((c) => (
                  <Link key={c.slug} href={`/c/${c.slug}`}>
                    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-surface-glass transition-colors group">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{c.name}</p>
                          <p className="text-[10px] text-muted">{c._count.members} member{c._count.members !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted">{c._count.posts} post{c._count.posts !== 1 ? "s" : ""}</span>
                        <ChevronRight className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Globe className="w-8 h-8 text-muted mb-3" />
                <p className="text-xs text-muted mb-3">No communities yet. Be the first!</p>
                <Link
                  href="/communities"
                  className="text-xs text-muted-light hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Create a community <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Trending Tokens */}
          <div className="glass-card bento-item p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-semibold text-foreground">Trending</h3>
              </div>
              <span className="text-[10px] text-muted uppercase tracking-wider">24h</span>
            </div>
            <PriceCards />
          </div>

          {/* Recent Activity */}
          <div className="glass-card bento-item p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-semibold text-foreground">Recent Posts</h3>
            </div>
            {recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="group cursor-pointer">
                    <p className="text-xs text-foreground group-hover:text-primary transition-colors leading-relaxed line-clamp-2">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted">@{post.author.username}</span>
                      <span className="text-[10px] text-muted">·</span>
                      <span className="text-[10px] text-muted flex items-center gap-0.5">
                        <MessageSquare className="w-2.5 h-2.5" /> {post._count.comments}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No posts yet. Join a community and start the conversation.</p>
            )}
          </div>

          {/* Stats Card */}
          <div className="glass-card bento-item p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-muted-light" />
              <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Users</p>
                <p className="text-xl font-semibold text-foreground">{userCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Communities</p>
                <p className="text-xl font-semibold text-foreground">{communityCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Posts</p>
                <p className="text-xl font-semibold text-secondary">{postCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          {[
            { icon: Users, title: "Communities", desc: "Join or create communities around tokens, protocols, and topics.", color: "text-primary", bg: "bg-primary-dim" },
            { icon: Shield, title: "Identity", desc: "Build your reputation with a unique username across all communities.", color: "text-accent", bg: "bg-accent-dim" },
            { icon: Zap, title: "Real-Time", desc: "Live chat, instant notifications, and streaming price feeds.", color: "text-warning", bg: "bg-warning-dim" },
          ].map((f) => (
            <div key={f.title} className="glass-card bento-item p-5">
              <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center mb-3`}>
                <f.icon className={`w-4 h-4 ${f.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}

          {/* CTA Card (full width) */}
          <div className="glass-card bento-item p-6 lg:col-span-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Ready to join?</h3>
                <p className="text-xs text-muted">Create your account and start connecting with the community.</p>
              </div>
            </div>
            <Link
              href="/register"
              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shrink-0"
            >
              Create Account
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <LoomLogo size={22} className="text-foreground" />
            <span className="text-base font-bold text-foreground tracking-tight">Loom</span>
          </div>
          <p className="text-[11px] text-muted">
            Built with Next.js &amp; Claude AI. Not financial advice. DYOR.
          </p>
        </div>
      </footer>
    </div>
  );
}
