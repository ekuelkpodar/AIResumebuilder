import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const tenantId = (session as any).tenantId ?? process.env.DEFAULT_TENANT_ID;
  if (!tenantId) return NextResponse.json({ error: { message: "Tenant required" } }, { status: 400 });

  const skills = await prisma.userSkill.findMany({
    where: { userId: session.user.id, tenantId },
    include: { skill: true },
    orderBy: { lastUpdatedAt: "desc" },
    take: 100,
  });
  return NextResponse.json({
    skills: skills.map((us) => ({
      id: us.id,
      name: us.skill.name,
      category: us.skill.category,
      proficiency: us.proficiency,
      confidence: us.confidence,
      source: us.source,
    })),
  });
}
