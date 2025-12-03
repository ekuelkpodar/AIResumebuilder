import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { outreachSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const items = await prisma.outreachMessage.findMany({
    where: { userId: session.user.id },
    include: { contact: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const body = await request.json();
  const parsed = outreachSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
  const item = await prisma.outreachMessage.create({
    data: {
      ...parsed.data,
      followUpDate: parsed.data.followUpDate ? new Date(parsed.data.followUpDate) : null,
      userId: session.user.id,
    },
  });
  return NextResponse.json({ item });
}
