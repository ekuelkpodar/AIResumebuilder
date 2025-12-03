"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Persona = {
  id: string;
  name: string;
  targetIndustry?: string;
  targetRoles: string[];
  summary?: string;
  skillsFocus: string[];
};

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [form, setForm] = useState({
    name: "Product Manager Persona",
    targetIndustry: "Technology",
    targetRoles: "Product Manager, Product Owner",
    summary: "",
    skillsFocus: "Roadmapping, User research, Stakeholder management",
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/personas");
    const json = await res.json();
    setPersonas(json.personas ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    setLoading(true);
    const res = await fetch("/api/personas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        targetIndustry: form.targetIndustry,
        targetRoles: form.targetRoles.split(",").map((r) => r.trim()),
        summary: form.summary,
        skillsFocus: form.skillsFocus.split(",").map((s) => s.trim()),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Could not create persona");
      return;
    }
    toast.success("Persona created");
    setForm((f) => ({ ...f, summary: "" }));
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Career personas</p>
          <h1 className="text-3xl font-semibold">Targeted profiles</h1>
          <p className="text-muted-foreground">
            Save multiple personas and link resumes to them for tailored messaging.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create persona</CardTitle>
          <CardDescription>Use AI later to refine this persona.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Target industry</Label>
            <Input
              value={form.targetIndustry}
              onChange={(e) => setForm((p) => ({ ...p, targetIndustry: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Target roles (comma separated)</Label>
            <Input
              value={form.targetRoles}
              onChange={(e) => setForm((p) => ({ ...p, targetRoles: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Summary</Label>
            <Textarea
              value={form.summary}
              onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Skills focus (comma separated)</Label>
            <Input
              value={form.skillsFocus}
              onChange={(e) => setForm((p) => ({ ...p, skillsFocus: e.target.value }))}
            />
          </div>
          <Button onClick={create} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Save persona
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {personas.map((persona) => (
          <Card key={persona.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {persona.name}
              </CardTitle>
              <CardDescription>{persona.targetIndustry}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Target roles: {persona.targetRoles.join(", ")}</p>
              <p>Skills focus: {persona.skillsFocus.join(", ")}</p>
              {persona.summary && <p className="text-foreground">{persona.summary}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
