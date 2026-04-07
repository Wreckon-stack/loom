"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import PostCard from "@/components/PostCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import {
  Users,
  Plus,
  X,
  Send,
  Loader2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface PostData {
  id: string;
  title: string;
  content: string;
  type: string;
  tweetUrl: string | null;
  author: { id: string; username: string; displayName: string; avatar: string | null };
  commentCount: number;
  voteCount: number;
  userVote: number;
  createdAt: string;
}

interface CommunityData {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  creator: { username: string; displayName: string };
  memberCount: number;
  postCount: number;
  isMember: boolean;
  memberRole: string | null;
  posts: PostData[];
}

export default function CommunityPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", type: "text", tweetUrl: "" });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [joining, setJoining] = useState(false);

  const fetchCommunity = useCallback(async () => {
    try {
      const res = await fetch(`/api/communities/${slug}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (res.ok) {
        setCommunity(await res.json());
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  const handleJoin = async () => {
    if (!user || joining) return;
    setJoining(true);
    try {
      const res = await fetch(`/api/communities/${slug}/join`, { method: "POST" });
      if (res.ok) {
        fetchCommunity();
      }
    } catch {
      // silently fail
    } finally {
      setJoining(false);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setPostError("");
    try {
      const res = await fetch(`/api/communities/${slug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          type: newPost.type,
          tweetUrl: newPost.type === "tweet" ? newPost.tweetUrl : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error);
        return;
      }
      setShowNewPost(false);
      setNewPost({ title: "", content: "", type: "text", tweetUrl: "" });
      fetchCommunity();
    } catch {
      setPostError("Something went wrong. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-5 h-5 text-muted animate-spin" />
      </div>
    );
  }

  if (notFound || !community) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-lg font-semibold text-foreground mb-2">Community not found</h1>
        <p className="text-xs text-muted">This community doesn&apos;t exist or may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Community Header */}
      <div className="glass-card p-5 mb-4">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
            style={{ backgroundColor: community.color }}
          >
            {community.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-semibold text-foreground">{community.name}</h1>
              {community.memberCount > 0 && <span className="tag tag-secondary">Active</span>}
            </div>
            <p className="text-xs text-muted leading-relaxed">{community.description}</p>
            <p className="text-[10px] text-muted mt-1">Created by @{community.creator.username}</p>
          </div>
          {user && (
            <button
              onClick={handleJoin}
              disabled={joining || community.memberRole === "admin"}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-opacity ${
                community.isMember
                  ? "bg-surface-glass text-muted-light hover:text-foreground"
                  : "bg-foreground text-background hover:opacity-90"
              } disabled:opacity-50`}
            >
              {joining ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : community.isMember ? (
                "Joined"
              ) : (
                <>Join <ChevronRight className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-surface-glass rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Members</p>
            <p className="text-sm font-semibold text-foreground">{community.memberCount.toLocaleString()}</p>
          </div>
          <div className="bg-surface-glass rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Posts</p>
            <p className="text-sm font-semibold text-foreground">{community.postCount}</p>
          </div>
          <div className="bg-surface-glass rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Role</p>
            <p className="text-sm font-semibold text-foreground capitalize">
              {community.memberRole || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main content */}
        <div className="flex-1 space-y-3">
          {/* New post button */}
          {user ? (
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="w-full glass-card p-3 flex items-center gap-3 hover:border-border-hover transition-all text-left"
            >
              <div className="w-8 h-8 bg-surface-glass rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-muted" />
              </div>
              <span className="text-xs text-muted">Create a post...</span>
            </button>
          ) : (
            <div className="glass-card p-3 flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-surface-glass rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-muted" />
              </div>
              <span className="text-xs text-muted">
                <a href="/login" className="text-muted-light hover:text-foreground transition-colors">Sign in</a> to create a post
              </span>
            </div>
          )}

          {/* New post form */}
          {showNewPost && (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-foreground">New Post</h3>
                <button onClick={() => setShowNewPost(false)} className="text-muted hover:text-foreground p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <form onSubmit={handlePost} className="space-y-2.5">
                <div className="flex gap-1.5">
                  {[
                    { value: "text", label: "Text" },
                    { value: "tweet", label: "Tweet", icon: ExternalLink },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNewPost({ ...newPost, type: opt.value })}
                      className={`px-2.5 py-1 text-[10px] rounded-md transition-colors flex items-center gap-1 ${
                        newPost.type === opt.value
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted hover:text-muted-light"
                      }`}
                    >
                      {opt.icon && <opt.icon className="w-2.5 h-2.5" />}
                      {opt.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Title"
                  className="w-full bg-background border border-border rounded-lg py-2 px-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
                  required
                  maxLength={300}
                />
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What's on your mind?"
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg py-2 px-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all resize-none"
                  required
                  maxLength={10000}
                />
                {newPost.type === "tweet" && (
                  <input
                    type="url"
                    value={newPost.tweetUrl}
                    onChange={(e) => setNewPost({ ...newPost, tweetUrl: e.target.value })}
                    placeholder="https://x.com/user/status/..."
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover transition-all"
                  />
                )}
                {postError && (
                  <div className="text-[11px] text-danger bg-danger/5 border border-danger/10 rounded-lg px-3 py-2">
                    {postError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={posting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {posting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  Post
                </button>
              </form>
            </div>
          )}

          {/* Posts feed */}
          {community.posts.length > 0 ? (
            community.posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                type={post.type}
                tweetUrl={post.tweetUrl}
                author={post.author}
                commentCount={post.commentCount}
                voteCount={post.voteCount}
                userVote={post.userVote}
                createdAt={post.createdAt}
              />
            ))
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-xs text-muted">No posts yet. Be the first to share something.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <TrendingSidebar />
        </div>
      </div>
    </div>
  );
}
