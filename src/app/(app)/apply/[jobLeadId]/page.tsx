"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type JobLead = { id: string; title: string; company: string; location?: string; link?: string };
type Persona = { id: string; name: string };
type Resume = { id: string; title: string };

export default function ApplyWizard() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobLead | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [personaId, setPersonaId] = useState<string>("");
  const [resumeId, setResumeId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/job-leads")
      .then((res) => res.json())
      .then((json) => setJob(json.items?.find((j: JobLead) => j.id === params?.jobLeadId) ?? null));
    fetch("/api/personas")
      .then((res) => res.json())
      .then((json) => setPersonas(json.personas ?? []));
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((json) => setResumes(json.resumes ?? []));
  }, [params?.jobLeadId]);

  const runTailor = async () => {
    if (!resumeId) {
      toast.error("Select a resume");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/ai/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeSnapshot: "Existing resume snapshot placeholder",
        jobDescription: notes || job?.title,
        extraNotes: personaId,
        tone: "Professional",
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Application prepared. Check cover letters.");
      router.push("/app/job-tracker");
    } else {
      toast.error("Unable to tailor right now");
    }
  };

  if (!job) return <div className="text-sm text-muted-foreground">Loading job...</div>;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>{job.company}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Persona</p>
            <Select onValueChange={setPersonaId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Resume</p>
            <Select onValueChange={setResumeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Job notes / description</p>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={runTailor} disabled={loading}>
            {loading ? "Preparing..." : "Tailor resume & cover letter"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Persona and resume selection with AI tailoring.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Job: {job.title}</p>
          <p>Company: {job.company}</p>
          <p>Persona: {personaId || "Not selected"}</p>
          <p>Resume: {resumeId || "Not selected"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
