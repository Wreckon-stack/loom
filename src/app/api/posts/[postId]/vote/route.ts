import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { postId } = await params;
    const { value } = await request.json();

    if (value !== 1 && value !== -1 && value !== 0) {
      return NextResponse.json({ error: "Value must be 1, -1, or 0" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existing = await prisma.vote.findUnique({
      where: { userId_postId: { userId: user.id, postId } },
    });

    if (value === 0) {
      // Remove vote
      if (existing) {
        await prisma.vote.delete({ where: { id: existing.id } });
      }
    } else if (existing) {
      // Update vote
      await prisma.vote.update({ where: { id: existing.id }, data: { value } });
    } else {
      // Create vote
      await prisma.vote.create({ data: { value, userId: user.id, postId } });
    }

    // Return updated count
    const votes = await prisma.vote.findMany({ where: { postId } });
    const voteCount = votes.reduce((sum, v) => sum + v.value, 0);

    return NextResponse.json({ voteCount, userVote: value });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
