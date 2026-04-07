import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const communities = await prisma.community.findMany({
      include: {
        _count: { select: { members: true, posts: true } },
        creator: { select: { username: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(communities);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { name, description, color } = await request.json();

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    if (name.length < 3 || name.length > 50) {
      return NextResponse.json({ error: "Name must be 3-50 characters" }, { status: 400 });
    }

    if (description.length < 10 || description.length > 500) {
      return NextResponse.json({ error: "Description must be 10-500 characters" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const existing = await prisma.community.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Community name already taken" }, { status: 409 });
    }

    const community = await prisma.community.create({
      data: {
        name,
        slug,
        description,
        color: color || "#8B5CF6",
        creatorId: user.id,
        members: {
          create: { userId: user.id, role: "admin" },
        },
      },
      include: {
        _count: { select: { members: true, posts: true } },
      },
    });

    return NextResponse.json(community, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
