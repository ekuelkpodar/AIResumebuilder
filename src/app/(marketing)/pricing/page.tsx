import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Great for trying ResumeCraft.",
    features: [
      "1 resume & cover letter",
      "Basic AI bullets",
      "1-click template switching",
      "Limited ATS checks",
    ],
    cta: "Start free",
    href: "/register",
  },
  {
    name: "Pro",
    price: "$12",
    description: "For active job seekers who want more polish.",
    features: [
      "Unlimited resumes & cover letters",
      "Full ATS checker + keyword highlights",
      "Job tracker & reminders",
      "Priority AI and PDF exports",
    ],
    cta: "Upgrade to Pro",
    href: "/register",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">Pricing</p>
        <h1 className="text-3xl font-semibold text-foreground">Pick a plan that fits</h1>
        <p className="text-muted-foreground">
          Start free. Upgrade only when you need unlimited resumes and deeper ATS analysis.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlight ? "border-primary shadow-lg shadow-primary/10" : ""}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                {plan.name}
                {plan.highlight && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Most popular
                  </span>
                )}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-semibold">{plan.price}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.highlight ? "default" : "outline"} asChild>
                <a href={plan.href}>{plan.cta}</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
