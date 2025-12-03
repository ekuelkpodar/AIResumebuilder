import { prisma } from "@/lib/prisma";
import { SkillProficiency, SkillSource } from "@prisma/client";

export async function upsertUserSkill({
  userId,
  tenantId,
  name,
  category,
  proficiency,
  confidence,
  source,
}: {
  userId: string;
  tenantId: string;
  name: string;
  category: "TECHNICAL" | "SOFT" | "DOMAIN";
  proficiency: SkillProficiency;
  confidence: number;
  source: SkillSource;
}) {
  const normalized = name.trim();
  const skill = await prisma.skill.upsert({
    where: { name: normalized },
    update: { category },
    create: { name: normalized, category, aliases: [] },
  });

  await prisma.userSkill.upsert({
    where: {
      userId_skillId_tenantId: {
        userId,
        skillId: skill.id,
        tenantId,
      },
    },
    update: {
      proficiency,
      confidence,
      source,
      lastUpdatedAt: new Date(),
    },
    create: {
      userId,
      tenantId,
      skillId: skill.id,
      proficiency,
      confidence,
      source,
    },
  });
}

export function normalizeCategory(raw?: string) {
  const input = (raw ?? "").toLowerCase();
  if (input.includes("soft")) return "SOFT";
  if (input.includes("domain")) return "DOMAIN";
  return "TECHNICAL";
}
