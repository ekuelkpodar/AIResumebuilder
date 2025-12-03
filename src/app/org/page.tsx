import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function OrgIndexPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const memberships = await prisma.organizationMembership.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Organizations</p>
          <h1 className="text-3xl font-semibold">Recruiter & team view</h1>
          <p className="text-muted-foreground">Manage openings and candidate submissions.</p>
        </div>
        <Button asChild>
          <a href="/org/new">Create org</a>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {memberships.map((member) => (
          <Card key={member.organization.id}>
            <CardHeader>
              <CardTitle>{member.organization.name}</CardTitle>
              <CardDescription>{member.organization.domain}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <a href={`/org/${member.organization.id}/jobs`}>Openings</a>
              </Button>
            </CardContent>
          </Card>
        ))}
        {memberships.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No organizations</CardTitle>
              <CardDescription>Create one to start reviewing candidates.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
