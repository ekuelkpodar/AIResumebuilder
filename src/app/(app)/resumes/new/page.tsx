"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultTemplates } from "@/lib/templates";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NewResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTemplate = searchParams.get("templateId");
  const [title, setTitle] = useState("New Resume");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (preselectedTemplate) {
      createResume(preselectedTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedTemplate]);

  const createResume = async (templateId?: string, importedData?: any) => {
    setCreating(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          templateId,
          data: importedData,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to create resume");
      router.push(`/app/resumes/${json.resume.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Create resume</p>
          <h1 className="text-3xl font-semibold text-foreground">Choose how you want to start</h1>
          <p className="text-muted-foreground">
            Start from a template, blank canvas, or import a file (stubbed parser).
          </p>
        </div>
      </div>
      <div className="max-w-md">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Blank
            </CardTitle>
            <CardDescription>Start fresh with empty sections.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => createResume()} disabled={creating || title.length < 2} className="w-full">
              Use blank canvas
            </Button>
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Templates
            </CardTitle>
            <CardDescription>Pick a layout that fits your role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {defaultTemplates.map((template) => (
              <Button
                key={template.id}
                variant="secondary"
                className="w-full justify-between"
                onClick={() => createResume(template.id)}
                disabled={creating || title.length < 2}
              >
                {template.name}
                <span className="text-xs text-muted-foreground">{template.category}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Import
            </CardTitle>
            <CardDescription>Upload a PDF/DOCX and we will prefill sections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                createResume(undefined, {
                  summary: "Seasoned generalist with experience across product and ops.",
                  experience: [
                    {
                      role: "Product Manager",
                      company: "Northwind",
                      period: "2022 - Present",
                      bullets: [
                        "Shipped onboarding overhaul that improved activation by 18%.",
                        "Partnered with sales to build a discovery workflow, shortening cycles by 12 days.",
                      ],
                    },
                  ],
                  skills: ["Roadmaps", "SQL", "Experimentation", "Stakeholder management"],
                })
              }
              disabled={creating || title.length < 2}
            >
              Upload file (stub)
            </Button>
            <p className="text-xs text-muted-foreground">
              Import is simulated. Replace with your parser later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
