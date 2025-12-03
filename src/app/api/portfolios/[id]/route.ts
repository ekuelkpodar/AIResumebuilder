import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { portfolioSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

type Context = { params: { id: string } };

export async function GET(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const item = await prisma.portfolio.findFirst({
    where: { id: context.params.id, userId: session.user.id },
    include: { projects: true },
  });
  if (!item) return NextResponse.json({ error: { message: "Not found" } }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const body = await request.json();
  const parsed = portfolioSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
  const item = await prisma.portfolio.update({
    where: { id: context.params.id, userId: session.user.id },
    data: parsed.data,
  });
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  await prisma.portfolio.delete({ where: { id: context.params.id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
