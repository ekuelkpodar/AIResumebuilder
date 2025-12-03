import { prisma } from "@/lib/prisma";

const envFlags = {
  careerAssistant: process.env.FLAG_CAREER_ASSISTANT !== "false",
  multiLanguage: process.env.FLAG_MULTI_LANGUAGE !== "false",
  collaboration: process.env.FLAG_COLLABORATION !== "false",
};

export async function isFeatureEnabled(userId: string | undefined, key: keyof typeof envFlags) {
  if (!envFlags[key]) return false;
  if (!userId) return envFlags[key];
  const userFlag = await prisma.featureFlag.findFirst({
    where: { userId, key },
  });
  if (userFlag) return userFlag.enabled;
  return envFlags[key];
}
