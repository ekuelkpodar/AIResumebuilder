import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { resumeUpdateSchema } from "@/lib/validators";

type Context = {
  params: { id: string };
};

export async function GET(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await prisma.resume.findFirst({
    where: { id: context.params.id, user: { email: session.user.email } },
    include: { sections: true },
  });

  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ resume });
}

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.resume.findFirst({
    where: { id: context.params.id, user: { email: session.user.email } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = resumeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const resume = await prisma.resume.update({
    where: { id: existing.id },
    data: {
      title: parsed.data.title,
      templateId: parsed.data.templateId,
      layout: parsed.data.layout,
      data: parsed.data.data,
      atsScore: parsed.data.atsScore,
    },
  });

  return NextResponse.json({ resume });
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.resume.findFirst({
    where: { id: context.params.id, user: { email: session.user.email } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.resume.delete({
    where: { id: existing.id },
  });
  return NextResponse.json({ ok: true });
}
