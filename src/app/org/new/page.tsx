import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function NewOrgPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  async function createOrg(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string) ?? "";
    const domain = (formData.get("domain") as string) ?? "";
    await prisma.organization.create({
      data: {
        name,
        domain,
        memberships: {
          create: {
            userId: session.user!.id,
            role: "OWNER",
          },
        },
      },
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Create organization</CardTitle>
          <CardDescription>Invite teammates later from the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createOrg} className="space-y-3">
            <Input name="name" placeholder="Org name" required />
            <Input name="domain" placeholder="company.com" />
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
