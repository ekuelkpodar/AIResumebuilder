import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

type Context = { params: { id: string } };

export async function POST(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const enable = Boolean(body?.enable ?? true);
  const resume = await prisma.resume.findFirst({
    where: { id: context.params.id, userId: session.user.id },
  });
  if (!resume) return NextResponse.json({ error: { message: "Not found" } }, { status: 404 });
  const shareToken = enable ? resume.shareToken ?? nanoid(16) : null;
  const updated = await prisma.resume.update({
    where: { id: resume.id },
    data: { isPublic: enable, shareToken },
  });
  return NextResponse.json({ shareToken: updated.shareToken, isPublic: updated.isPublic });
}
