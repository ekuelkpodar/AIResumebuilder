"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  confidence: number;
  source: string;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const load = async () => {
    const res = await fetch("/api/skills");
    const json = await res.json();
    setSkills(json.skills ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const extract = async () => {
    const res = await fetch("/api/ai/extract-user-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeText: "Placeholder resume context from existing resumes.",
      }),
    });
    if (res.ok) {
      toast.success("Skills extracted");
      load();
    } else {
      const json = await res.json();
      toast.error(json.error?.message ?? "Unable to extract skills");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Skills graph</p>
          <h1 className="text-3xl font-semibold">Your skills profile</h1>
          <p className="text-muted-foreground">
            AI-extracted skills with proficiency. Future updates will map to talent insights per tenant.
          </p>
        </div>
        <Button onClick={extract}>Extract from resume</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardHeader className="flex items-center justify-between space-y-0">
              <CardTitle className="text-lg">{skill.name}</CardTitle>
              <Badge variant="secondary">{skill.category}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase text-muted-foreground">{skill.proficiency}</span>
                <span className="text-xs text-muted-foreground">{skill.source}</span>
              </div>
              <Progress value={skill.confidence * 100} />
            </CardContent>
          </Card>
        ))}
        {skills.length === 0 && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>No skills yet</CardTitle>
              <CardDescription>Extract from your resume to build your skills graph.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
