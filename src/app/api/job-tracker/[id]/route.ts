import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { jobApplicationSchema } from "@/lib/validators";

type Context = { params: { id: string } };

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.jobApplication.findFirst({
    where: { id: context.params.id, user: { email: session.user.email } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = jobApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const job = await prisma.jobApplication.update({
    where: { id: existing.id },
    data: {
      ...parsed.data,
      appliedAt: parsed.data.appliedAt ? new Date(parsed.data.appliedAt) : null,
      reminderDate: parsed.data.reminderDate ? new Date(parsed.data.reminderDate) : null,
    },
  });

  return NextResponse.json({ job });
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.jobApplication.findFirst({
    where: { id: context.params.id, user: { email: session.user.email } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.jobApplication.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
