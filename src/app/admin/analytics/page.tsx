import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") redirect("/app/dashboard");

  const [userCount, resumeCount, coverCount, jobCount, aiCount] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.coverLetter.count(),
    prisma.jobApplication.count(),
    prisma.aICallLog.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Admin</p>
        <h1 className="text-3xl font-semibold">Platform analytics</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["Users", userCount], ["Resumes", resumeCount], ["Cover letters", coverCount], ["Job apps", jobCount]].map(
          ([label, value]) => (
            <Card key={label}>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{value as number}</CardContent>
            </Card>
          ),
        )}
        <Card>
          <CardHeader>
            <CardTitle>AI calls</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{aiCount}</CardContent>
        </Card>
      </div>
    </div>
  );
}
