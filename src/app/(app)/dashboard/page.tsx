import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  let resumes =
    (await prisma.resume
      .findMany({
        where: { user: { email: session.user.email } },
        orderBy: { updatedAt: "desc" },
      })
      .catch(() => [])) || [];

  let jobStats =
    (await prisma.jobApplication
      .groupBy({
        by: ["status"],
        where: { user: { email: session.user.email } },
        _count: { _all: true },
      })
      .catch(() => [])) || [];

  // Provide lightweight sample state for empty DBs.
  if (!resumes.length) {
    resumes = [
      {
        id: "sample",
        title: "Product Manager Resume – 2025",
        atsScore: 82,
        updatedAt: new Date(),
      },
    ] as any;
  }

  const totalJobs = jobStats.reduce((sum, stat) => sum + stat._count._all, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Dashboard</p>
          <h1 className="text-3xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">
            Track resumes, run ATS checks, and keep your job search organized.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/app/resumes/new">Create new resume</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/app/ats-checker">Run ATS check</a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Resumes</CardTitle>
            <CardDescription>Recent updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {resumes.map((resume: any) => (
              <div key={resume.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{resume.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                  {resume.atsScore && <Badge variant="secondary">ATS {resume.atsScore}</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job tracker</CardTitle>
            <CardDescription>Pipeline snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {["TO_APPLY", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"].map((status) => {
              const count =
                jobStats.find((stat: any) => stat.status === status)?._count?._all ?? 0;
              return (
                <div key={status} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                  <span className="font-medium text-foreground">
                    {status.replace("_", " ").toLowerCase()}
                  </span>
                  <span className="text-foreground">{count}</span>
                </div>
              );
            })}
            {!totalJobs && (
              <p className="text-xs text-muted-foreground">
                No job applications yet. Add your first entry to start tracking.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-amber-300" /> Quick actions
            </CardTitle>
            <CardDescription className="text-slate-200">
              Finish setup in a few clicks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="secondary" className="w-full" asChild>
              <a href="/app/cover-letters/new">Generate cover letter</a>
            </Button>
            <Button variant="outline" className="w-full bg-white/10 text-white" asChild>
              <a href="/app/job-tracker">Start new job tracker entry</a>
            </Button>
            <Button variant="ghost" className="w-full border border-white/20 text-white" asChild>
              <a href="/app/onboarding">Update career profile</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
