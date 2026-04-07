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
    const community = await prisma.community.findUnique({ where: { slug } });
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    const existing = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: user.id, communityId: community.id } },
    });

    if (existing) {
      // Leave community (but not if admin/creator)
      if (community.creatorId === user.id) {
        return NextResponse.json({ error: "Creators cannot leave their community" }, { status: 400 });
      }
      await prisma.communityMember.delete({ where: { id: existing.id } });
      return NextResponse.json({ joined: false });
    }

    // Join community
    await prisma.communityMember.create({
      data: { userId: user.id, communityId: community.id },
    });

    return NextResponse.json({ joined: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
