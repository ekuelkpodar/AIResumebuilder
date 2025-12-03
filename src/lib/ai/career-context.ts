import { prisma } from "@/lib/prisma";

export type CareerContext = {
  profile?: {
    careerStage?: string | null;
    industry?: string | null;
    goal?: string | null;
    location?: string | null;
  };
  timeline: { role?: string; company?: string; period?: string }[];
  skills: string[];
  industryExperience: string[];
  careerGoals: string[];
};

export async function buildCareerContext(userId: string): Promise<CareerContext> {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  const resumes = await prisma.resume.findMany({ where: { userId } });
  const applications = await prisma.jobApplication.findMany({ where: { userId } });

  const timeline: CareerContext["timeline"] = [];
  const skills: Set<string> = new Set();

  resumes.forEach((resume) => {
    const data = (resume.data as any) || {};
    (data.experience ?? []).forEach((exp: any) => {
      timeline.push({ role: exp.role, company: exp.company, period: exp.period });
      (exp.bullets ?? []).forEach((b: string) => {
        const tokens = b.split(/[,.;]/).map((t) => t.trim());
        tokens.forEach((t) => {
          if (t.length > 2) skills.add(t);
        });
      });
    });
    (data.skills ?? []).forEach((s: string) => skills.add(s));
  });

  const industryExperience = Array.from(
    new Set([profile?.industry, ...(resumes.map((r) => (r.data as any)?.industry ?? []))].filter(
      Boolean,
    )),
  ).map(String);

  const careerGoals = profile?.goal ? [profile.goal] : [];
  applications.forEach((app) => {
    if (app.title) careerGoals.push(app.title);
  });

  return {
    profile: profile ?? undefined,
    timeline,
    skills: Array.from(skills).slice(0, 50),
    industryExperience,
    careerGoals,
  };
}
