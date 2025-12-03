import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { coverLetterSchema } from "@/lib/validators";

type Context = { params: { id: string } };

export async function GET(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const coverLetter = await prisma.coverLetter.findFirst({
    where: { id: context.params.id, user: { email: session.user.email } },
  });
  if (!coverLetter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ coverLetter });
}

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = coverLetterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const coverLetter = await prisma.coverLetter.update({
    where: { id: coverLetter.id },
    data: parsed.data,
  });
  return NextResponse.json({ coverLetter });
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const coverLetter = await prisma.coverLetter.findFirst({
    where: { id: context.params.id, user: { email: session.user.email } },
  });
  if (!coverLetter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.coverLetter.delete({ where: { id: coverLetter.id } });
  return NextResponse.json({ ok: true });
}
