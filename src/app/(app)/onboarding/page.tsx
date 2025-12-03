"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { onboardingSchema } from "@/lib/validators";
import { toast } from "sonner";

const careerStages = ["STUDENT", "JUNIOR", "MID", "SENIOR", "EXECUTIVE"];
const industries = ["Technology", "Marketing", "Finance", "Healthcare", "Operations", "Education"];
const goals = ["Get first job", "Career change", "Promotion", "Remote role", "Leadership"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    careerStage: "",
    industry: "",
    goal: "",
    location: "",
    headline: "",
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const saveProfile = async () => {
    const parsed = onboardingSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Please complete all steps.");
      return;
    }
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      toast.error("Unable to save profile");
      return;
    }
    toast.success("Profile saved");
    router.push("/app/dashboard");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-primary">Onboarding</p>
        <h1 className="text-3xl font-semibold text-foreground">Tailor your experience</h1>
        <p className="text-muted-foreground">
          We use this to personalize AI suggestions and template recommendations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {step + 1} of 3</CardTitle>
          <CardDescription>Select the option that fits best.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-3">
              <Label>Career stage</Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {careerStages.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setData((d) => ({ ...d, careerStage: stage }))}
                    className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                      data.careerStage === stage ? "border-primary bg-primary/5" : "hover:border-primary"
                    }`}
                  >
                    {stage.toLowerCase().replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <Label>Industry</Label>
              <Select
                onValueChange={(value) => setData((d) => ({ ...d, industry: value }))}
                value={data.industry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>Career goal</Label>
              <Select onValueChange={(value) => setData((d) => ({ ...d, goal: value }))} value={data.goal}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label>Location (optional)</Label>
              <Input
                placeholder="City, Country"
                value={data.location}
                onChange={(e) => setData((d) => ({ ...d, location: e.target.value }))}
              />
              <Label>Headline (optional)</Label>
              <Input
                placeholder="Product designer focused on growth"
                value={data.headline}
                onChange={(e) => setData((d) => ({ ...d, headline: e.target.value }))}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={prevStep} disabled={step === 0}>
              Back
            </Button>
            {step < 2 ? (
              <Button onClick={nextStep}>Continue</Button>
            ) : (
              <Button onClick={saveProfile}>Finish</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
