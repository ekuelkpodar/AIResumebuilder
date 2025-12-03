import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { jobApplicationSchema } from "@/lib/validators";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.jobApplication.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ jobs: items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = jobApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const job = await prisma.jobApplication.create({
    data: {
      ...parsed.data,
      appliedAt: parsed.data.appliedAt ? new Date(parsed.data.appliedAt) : null,
      reminderDate: parsed.data.reminderDate ? new Date(parsed.data.reminderDate) : null,
      userId: user.id,
    },
  });

  return NextResponse.json({ job });
}
