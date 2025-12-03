import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { organizationSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const orgs = await prisma.organizationMembership.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  });
  return NextResponse.json({ organizations: orgs.map((o) => o.organization) });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const body = await request.json();
  const parsed = organizationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
  const org = await prisma.organization.create({
    data: {
      ...parsed.data,
      memberships: {
        create: {
          userId: session.user.id,
          role: "OWNER",
        },
      },
    },
  });
  return NextResponse.json({ organization: org });
}
