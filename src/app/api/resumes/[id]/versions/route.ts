import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = { params: { id: string } };

export async function GET(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const versions = await prisma.resumeVersion.findMany({
    where: { resumeId: context.params.id, resume: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ versions });
}

export async function POST(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const resume = await prisma.resume.findFirst({
    where: { id: context.params.id, userId: session.user.id },
  });
  if (!resume) return NextResponse.json({ error: { message: "Not found" } }, { status: 404 });
  const body = await request.json();
  const label = body?.label as string | undefined;
  const version = await prisma.resumeVersion.create({
    data: {
      resumeId: resume.id,
      label: label?.slice(0, 120),
      dataSnapshot: resume.data,
      atsScoreSnapshot: resume.atsScore,
    },
  });
  return NextResponse.json({ version });
}
