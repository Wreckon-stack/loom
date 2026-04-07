"use client";

import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, ExternalLink } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  type: string;
  tweetUrl?: string | null;
  author: {
    username: string;
    displayName: string;
  };
  commentCount: number;
  voteCount: number;
  userVote?: number;
  createdAt: string;
}

export default function PostCard({
  id,
  title,
  content,
  type,
  tweetUrl,
  author,
  commentCount,
  voteCount: initialVoteCount,
  userVote: initialUserVote = 0,
  createdAt,
}: PostCardProps) {
  const [votes, setVotes] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState(initialUserVote);

  const handleVote = async (value: number) => {
    const newValue = userVote === value ? 0 : value;

    // Optimistic update
    setVotes(votes - userVote + newValue);
    setUserVote(newValue);

    try {
      const res = await fetch(`/api/posts/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      });
      if (res.ok) {
        const data = await res.json();
        setVotes(data.voteCount);
        setUserVote(data.userVote);
      }
    } catch {
      // Revert on error
      setVotes(initialVoteCount);
      setUserVote(initialUserVote);
    }
  };

  const timeAgo = getTimeAgo(createdAt);

  const shareToX = () => {
    const text = encodeURIComponent(`Check out "${title}" on Loom!`);
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="glass-card p-4 transition-all duration-200">
      <div className="flex gap-3">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5 pt-0.5">
          <button
            onClick={() => handleVote(1)}
            className={`p-1 rounded-lg transition-colors ${
              userVote === 1 ? "text-secondary bg-secondary-dim" : "text-muted hover:text-secondary"
            }`}
          >
            <ArrowBigUp className="w-4 h-4" />
          </button>
          <span className={`text-xs font-semibold font-mono ${
            userVote === 1 ? "text-secondary" : userVote === -1 ? "text-danger" : "text-muted-light"
          }`}>
            {votes}
          </span>
          <button
            onClick={() => handleVote(-1)}
            className={`p-1 rounded-lg transition-colors ${
              userVote === -1 ? "text-danger bg-accent-dim" : "text-muted hover:text-danger"
            }`}
          >
            <ArrowBigDown className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] text-muted mb-1.5">
            <span className="font-medium text-muted-light">@{author.username}</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>

          <h3 className="text-sm font-medium text-foreground mb-1.5 leading-snug">{title}</h3>
          <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">{content}</p>

          {type === "tweet" && tweetUrl && (
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] text-muted-light hover:text-foreground bg-surface-glass rounded-lg px-2.5 py-1.5 mb-3 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View on X
            </a>
          )}

          <div className="flex items-center gap-3 text-[10px] text-muted">
            <button className="flex items-center gap-1 hover:text-muted-light transition-colors">
              <MessageSquare className="w-3 h-3" />
              {commentCount}
            </button>
            <button
              onClick={shareToX}
              className="flex items-center gap-1 hover:text-muted-light transition-colors"
            >
              <Share2 className="w-3 h-3" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
