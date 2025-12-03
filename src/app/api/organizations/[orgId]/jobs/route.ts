import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { jobOpeningSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

type Context = { params: { orgId: string } };

export async function GET(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const jobs = await prisma.jobOpening.findMany({
    where: { organizationId: context.params.orgId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ jobs });
}

export async function POST(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const body = await request.json();
  const parsed = jobOpeningSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
  const job = await prisma.jobOpening.create({
    data: {
      ...parsed.data,
      organizationId: context.params.orgId,
    },
  });
  return NextResponse.json({ job });
}
