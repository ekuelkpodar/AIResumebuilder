import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const profile = await prisma.userProfile
    .findFirst({
      where: { user: { email: session.user.email } },
    })
    .catch(() => null);
  const subscription = await prisma.subscription
    .findFirst({
      where: { user: { email: session.user.email } },
    })
    .catch(() => null);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span> {session.user.name ?? "Your name"}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span> {session.user.email}
          </p>
          <p>
            <span className="text-muted-foreground">Location:</span>{" "}
            {profile?.location ?? "Add via onboarding"}
          </p>
          <Button variant="outline" asChild className="mt-2">
            <a href="/app/onboarding">Update career profile</a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Free vs Pro access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Plan:</span>{" "}
            {subscription?.plan ?? "FREE"}
          </p>
          <p>
            <span className="text-muted-foreground">Status:</span>{" "}
            {subscription?.status ?? "TRIALING"}
          </p>
          <p className="text-xs text-muted-foreground">
            Payments are stubbed. Swap this with a Stripe checkout when ready.
          </p>
          <Button>Upgrade to Pro</Button>
        </CardContent>
      </Card>
    </div>
  );
}
