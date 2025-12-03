import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { params: { orgId: string; jobId: string } };

export default async function JobDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const job = await prisma.jobOpening.findUnique({
    where: { id: params.jobId },
    include: { submissions: true },
  });
  if (!job) redirect(`/org/${params.orgId}/jobs`);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-primary">Candidates</p>
        <h1 className="text-3xl font-semibold">{job.title}</h1>
        <p className="text-muted-foreground">{job.description}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {job.submissions.map((sub) => (
          <Card key={sub.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {sub.candidateName} <Badge variant="secondary">{sub.status}</Badge>
              </CardTitle>
              <CardDescription>{sub.candidateEmail}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a className="text-primary text-sm" href={sub.resumeLink} target="_blank" rel="noreferrer">
                View resume
              </a>
              {sub.notes && <p className="text-sm text-muted-foreground">{sub.notes}</p>}
              <Button variant="outline" size="sm" asChild>
                <a href={`/api/ai/recruiter-feedback`} target="_blank" rel="noreferrer">
                  AI review (submit manually)
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
