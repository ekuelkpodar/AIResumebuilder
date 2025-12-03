import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = { params: { orgId: string } };

export default async function OrgJobsPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const org = await prisma.organization.findUnique({ where: { id: params.orgId } });
  if (!org) redirect("/org");
  const jobs = await prisma.jobOpening.findMany({
    where: { organizationId: params.orgId },
    orderBy: { createdAt: "desc" },
  });

  async function createJob(formData: FormData) {
    "use server";
    await prisma.jobOpening.create({
      data: {
        organizationId: params.orgId,
        title: (formData.get("title") as string) ?? "",
        description: (formData.get("description") as string) ?? "",
        location: (formData.get("location") as string) ?? "",
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{org.name}</p>
          <h1 className="text-3xl font-semibold">Job openings</h1>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New opening</CardTitle>
            <CardDescription>Create a role candidates can apply to.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createJob} className="space-y-2">
              <Input name="title" placeholder="Role title" required />
              <Input name="location" placeholder="Location" />
              <Textarea name="description" placeholder="Description" />
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" asChild>
                <a href={`/org/${params.orgId}/jobs/${job.id}`}>View candidates</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href={`/apply/${job.id}`} target="_blank" rel="noreferrer">
                  Public apply link
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
