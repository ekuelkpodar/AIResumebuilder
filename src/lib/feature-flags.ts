import { prisma } from "@/lib/prisma";

const envFlags = {
  careerAssistant: process.env.FLAG_CAREER_ASSISTANT !== "false",
  multiLanguage: process.env.FLAG_MULTI_LANGUAGE !== "false",
  collaboration: process.env.FLAG_COLLABORATION !== "false",
  recruiterPortal: process.env.FLAG_RECRUITER_PORTAL !== "false",
};

export async function isFeatureEnabled(
  userId: string | undefined,
  key: keyof typeof envFlags,
  tenantId?: string,
) {
  if (!envFlags[key]) return false;
  if (!userId) return envFlags[key];
  const userFlag = await prisma.featureFlag.findFirst({
    where: { userId, key, tenantId },
  });
  if (userFlag) return userFlag.enabled;
  return envFlags[key];
}
