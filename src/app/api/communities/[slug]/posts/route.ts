import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { slug } = await params;
    const { title, content, type, tweetUrl } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    if (title.length > 300) {
      return NextResponse.json({ error: "Title too long" }, { status: 400 });
    }

    if (content.length > 10000) {
      return NextResponse.json({ error: "Content too long" }, { status: 400 });
    }

    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type: type || "text",
        tweetUrl: tweetUrl || null,
        authorId: user.id,
        communityId: community.id,
      },
      include: {
        author: { select: { id: true, username: true, displayName: true, avatar: true } },
        _count: { select: { comments: true } },
      },
    });

    return NextResponse.json({
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type,
      tweetUrl: post.tweetUrl,
      createdAt: post.createdAt,
      author: post.author,
      commentCount: post._count.comments,
      voteCount: 0,
      userVote: 0,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
