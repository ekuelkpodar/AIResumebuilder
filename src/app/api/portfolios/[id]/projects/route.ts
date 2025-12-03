import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { portfolioProjectSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

type Context = { params: { id: string } };

export async function POST(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const body = await request.json();
  const parsed = portfolioProjectSchema.safeParse({ ...body, portfolioId: context.params.id });
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
  const item = await prisma.portfolioProject.create({
    data: parsed.data,
  });
  return NextResponse.json({ item });
}
