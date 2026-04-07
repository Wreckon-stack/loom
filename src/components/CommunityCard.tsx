"use client";

import Link from "next/link";
import { Users, MessageSquare, ChevronRight } from "lucide-react";

interface CommunityCardProps {
  name: string;
  slug: string;
  description: string;
  color: string;
  memberCount: number;
  postCount: number;
}

export default function CommunityCard({
  name,
  slug,
  description,
  color,
  memberCount,
  postCount,
}: CommunityCardProps) {
  return (
    <Link href={`/c/${slug}`}>
      <div className="glass-card bento-item p-5 cursor-pointer group h-full">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: color }}
          >
            {name.charAt(0)}
          </div>
          <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
          {name}
        </h3>
        <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">{description}</p>

        <div className="flex items-center gap-4 text-[10px] text-muted uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {memberCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {postCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
