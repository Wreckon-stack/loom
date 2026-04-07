"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import CommunityCard from "@/components/CommunityCard";
import { Plus, Search, Loader2, Globe, X } from "lucide-react";
import Link from "next/link";

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  _count: { members: number; posts: number };
  creator: { username: string };
}

export default function CommunitiesPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "", color: "#a78bfa" });

  const fetchCommunities = useCallback(async () => {
    try {
      const res = await fetch("/api/communities");
      if (res.ok) {
        const data = await res.json();
        setCommunities(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const filtered = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommunity),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error);
        return;
      }
      setShowCreate(false);
      setNewCommunity({ name: "", description: "", color: "#a78bfa" });
      fetchCommunities();
    } catch {
      setCreateError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-accent" />
            <h1 className="text-lg font-semibold text-foreground">Communities</h1>
          </div>
          <p className="text-xs text-muted">Find your tribe in the crypto space</p>
        </div>
        {user ? (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            Create
          </button>
        ) : (
          <Link
            href="/register"
            className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign up to create
          </Link>
        )}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">New Community</h2>
            <button onClick={() => setShowCreate(false)} className="text-muted hover:text-foreground p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5">Name</label>
              <input
                type="text"
                value={newCommunity.name}
                onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                placeholder="e.g., Ethereum Builders"
                className="w-full bg-background border border-border rounded-lg py-2 px-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
                required
                minLength={3}
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={newCommunity.description}
                onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                placeholder="What's this community about? (min 10 characters)"
                rows={3}
                className="w-full bg-background border border-border rounded-lg py-2 px-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all resize-none"
                required
                minLength={10}
                maxLength={500}
              />
            </div>
            <div>
              <label className="block text-[10px] text-muted uppercase tracking-wider mb-1.5">Color</label>
              <div className="flex gap-2">
                {["#a78bfa", "#f472b6", "#34d399", "#f7931a", "#60a5fa", "#fbbf24"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCommunity({ ...newCommunity, color })}
                    className={`w-7 h-7 rounded-lg transition-all ${
                      newCommunity.color === color ? "ring-2 ring-foreground/30 ring-offset-2 ring-offset-card scale-110" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            {createError && (
              <div className="text-[11px] text-danger bg-danger/5 border border-danger/10 rounded-lg px-3 py-2">
                {createError}
              </div>
            )}
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Create Community"}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
        <input
          type="text"
          placeholder="Search communities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border rounded-xl py-2.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 text-muted animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((community) => (
            <CommunityCard
              key={community.id}
              name={community.name}
              slug={community.slug}
              description={community.description}
              color={community.color}
              memberCount={community._count.members}
              postCount={community._count.posts}
            />
          ))}
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-20">
          <Globe className="w-8 h-8 text-muted mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-foreground mb-1">No communities yet</h3>
          <p className="text-xs text-muted mb-4">Be the first to create a community and start the conversation.</p>
          {user && (
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              Create the first community
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xs text-muted">No communities match your search.</p>
        </div>
      )}
    </div>
  );
}
