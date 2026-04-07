import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const user = await getSession();

    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        _count: { select: { members: true, posts: true } },
        creator: { select: { username: true, displayName: true } },
        posts: {
          include: {
            author: { select: { id: true, username: true, displayName: true, avatar: true } },
            _count: { select: { comments: true } },
            votes: { select: { value: true, userId: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // Check if current user is a member
    let membership = null;
    if (user) {
      membership = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId: user.id, communityId: community.id } },
      });
    }

    // Transform posts to include computed vote counts and user's vote
    const posts = community.posts.map((post) => {
      const voteCount = post.votes.reduce((sum, v) => sum + v.value, 0);
      const userVote = user ? post.votes.find((v) => v.userId === user.id)?.value ?? 0 : 0;
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        type: post.type,
        tweetUrl: post.tweetUrl,
        createdAt: post.createdAt,
        author: post.author,
        commentCount: post._count.comments,
        voteCount,
        userVote,
      };
    });

    return NextResponse.json({
      id: community.id,
      name: community.name,
      slug: community.slug,
      description: community.description,
      color: community.color,
      icon: community.icon,
      banner: community.banner,
      createdAt: community.createdAt,
      creator: community.creator,
      memberCount: community._count.members,
      postCount: community._count.posts,
      isMember: !!membership,
      memberRole: membership?.role ?? null,
      posts,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
