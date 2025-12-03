import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { candidateSubmissionSchema, jobOpeningSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

type Context = { params: { orgId: string; jobId: string } };

export async function GET(_request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const job = await prisma.jobOpening.findUnique({
    where: { id: context.params.jobId },
    include: { submissions: true },
  });
  if (!job) return NextResponse.json({ error: { message: "Not found" } }, { status: 404 });
  return NextResponse.json({ job });
}

export async function PUT(request: Request, context: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const body = await request.json();
  const parsed = jobOpeningSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
  const job = await prisma.jobOpening.update({
    where: { id: context.params.jobId },
    data: parsed.data,
  });
  return NextResponse.json({ job });
}

export async function POST(request: Request, context: Context) {
  const body = await request.json();
  const parsed = candidateSubmissionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
  const submission = await prisma.candidateSubmission.create({
    data: { ...parsed.data, jobOpeningId: context.params.jobId },
  });
  return NextResponse.json({ submission });
}
