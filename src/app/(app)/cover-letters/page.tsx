import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FilePenLine } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function CoverLettersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");
  const items =
    (await prisma.coverLetter
      .findMany({
        where: { user: { email: session.user.email } },
        orderBy: { updatedAt: "desc" },
      })
      .catch(() => [])) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Cover letters</p>
          <h1 className="text-3xl font-semibold">Tell your story</h1>
          <p className="text-muted-foreground">Generate and refine cover letters with AI.</p>
        </div>
        <Button asChild>
          <a href="/app/cover-letters/new">Create cover letter</a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.length === 0 && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No cover letters yet</CardTitle>
              <CardDescription>Generate one tailored to your next application.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/app/cover-letters/new">Start writing</a>
              </Button>
            </CardContent>
          </Card>
        )}
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilePenLine className="h-4 w-4 text-primary" />
                {item.title}
              </CardTitle>
              <CardDescription>Updated {formatDate(item.updatedAt)}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button asChild size="sm">
                <a href={`/app/cover-letters/${item.id}`}>Edit</a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={`/api/resumes/${item.resumeId ?? ""}/pdf`} target="_blank" rel="noreferrer">
                  Download
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
