"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Score = {
  score: number;
  breakdown: {
    keywords: number;
    structure: number;
    bulletQuality: number;
    length: number;
  };
  missingKeywords: string[];
  suggestions: string[];
  coverage?: { score: number; strong: string[]; weak: string[] };
};

export default function AtsCheckerPage() {
  const [resumes, setResumes] = useState<{ id: string; title: string }[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<Score | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((json) => setResumes(json.resumes ?? []));
  }, []);

  const runCheck = async () => {
    setLoading(true);
    const resumeText =
      "Placeholder resume text. Replace with selected resume content when integrated.";
    const res = await fetch("/api/ai/ats-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription }),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">ATS checker</p>
          <h1 className="text-3xl font-semibold text-foreground">Optimize for job scans</h1>
          <p className="text-muted-foreground">
            Paste a job description and see how well your resume matches.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Run a check</CardTitle>
          <CardDescription>Select a resume and provide the job description.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Resume</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
            >
              <option value="">Select a resume</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Job description</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the role description..."
            />
          </div>
          <Button onClick={runCheck} disabled={loading || !jobDescription}>
            {loading ? "Running..." : "Run ATS check"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-4 lg:grid-cols-[1fr,0.6fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>ATS score</CardTitle>
                <CardDescription>Higher scores usually mean better matches.</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <ShieldCheck className="h-6 w-6 text-primary" /> {result.score}/100
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {Object.entries(result.breakdown).map(([key, value]) => (
                <div key={key} className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{key}</p>
                  <p className="text-lg font-semibold">{value}/100</p>
                </div>
              ))}
              {result.coverage && (
                <div className="rounded-lg border bg-muted/30 p-3 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Skills & keywords coverage
                  </p>
                  <p className="text-lg font-semibold">{result.coverage.score}/100</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {result.coverage.strong.slice(0, 6).map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Gaps: {result.coverage.weak.slice(0, 6).join(", ") || "None"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Fix these to improve your score.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Missing keywords</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw) => (
                    <Badge key={kw} variant="secondary">
                      {kw}
                    </Badge>
                  ))}
                  {result.missingKeywords.length === 0 && (
                    <p className="text-xs text-muted-foreground">No major gaps detected.</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Suggested changes</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {result.suggestions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Flame className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
