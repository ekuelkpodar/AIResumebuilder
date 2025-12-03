import { prisma } from "@/lib/prisma";

export async function generateDashboardRecommendations(userId: string) {
  const resumes = await prisma.resume.findMany({ where: { userId } });
  const jobApplications = await prisma.jobApplication.findMany({ where: { userId } });
  const recs: string[] = [];

  if (resumes.length === 0) {
    recs.push("Create your first resume to unlock ATS checks and cover letters.");
  }
  const lowAts = resumes.filter((r) => (r.atsScore ?? 0) < 70);
  if (lowAts.length) {
    recs.push(
      `Your last ATS score is ${lowAts[0].atsScore ?? "—"}. Run optimization for your target role.`,
    );
  }
  const interviewing = jobApplications.filter((j) => j.status === "INTERVIEWING").length;
  const applied = jobApplications.length;
  if (applied > 5 && interviewing <= 1) {
    recs.push("You have many applications but few interviews. Refresh your summary and keywords.");
  }
  if (jobApplications.some((j) => j.status === "TO_APPLY")) {
    recs.push("Move ready applications to Applied and set reminders to stay on track.");
  }

  return recs.slice(0, 4);
}

export async function atsSummary(userId: string) {
  const data = await prisma.resume.findMany({
    where: { userId },
    select: { id: true, title: true, atsScore: true, updatedAt: true },
  });
  const scores = data.map((r) => r.atsScore ?? 0);
  const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  return { average, data };
}

export async function jobStatusSummary(userId: string) {
  const grouped = await prisma.jobApplication.groupBy({
    by: ["status"],
    where: { userId },
    _count: { _all: true },
  });
  return grouped.map((g) => ({ status: g.status, count: g._count._all }));
}
