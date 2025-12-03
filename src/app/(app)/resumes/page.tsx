import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Edit, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DeleteResumeButton } from "@/components/resumes/delete-resume-button";

export default async function ResumesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const resumes =
    (await prisma.resume
      .findMany({
        where: { user: { email: session.user.email } },
        orderBy: { updatedAt: "desc" },
      })
      .catch(() => [])) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Resumes</p>
          <h1 className="text-3xl font-semibold text-foreground">Your documents</h1>
          <p className="text-muted-foreground">Create, duplicate, or download any resume.</p>
        </div>
        <Button asChild>
          <a href="/app/resumes/new">New resume</a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resumes.length === 0 && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No resumes yet</CardTitle>
              <CardDescription>Start with a template or import a file.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/app/resumes/new">Create your first resume</a>
              </Button>
            </CardContent>
          </Card>
        )}
        {resumes.map((resume) => (
          <Card key={resume.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{resume.title}</CardTitle>
              <CardDescription>
                Updated {formatDate(resume.updatedAt)} • ATS {resume.atsScore ?? "—"}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex items-center gap-3">
              <Button asChild size="sm">
                <a href={`/app/resumes/${resume.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={`/api/resumes/${resume.id}/pdf`} target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-4 w-4" /> PDF
                </a>
              </Button>
              <DeleteResumeButton id={resume.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
