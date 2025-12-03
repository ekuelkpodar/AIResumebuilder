"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function NewCoverLetterPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Cover letter for Growth PM");
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeSnapshot: "Product manager with growth and onboarding experience.",
        jobDescription,
        extraNotes: notes,
        tone: "Professional",
      }),
    });
    const json = await res.json();
    setContent(json.coverLetter);
    setLoading(false);
  };

  const saveCoverLetter = async () => {
    const res = await fetch("/api/cover-letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      toast.success("Cover letter saved");
      router.push("/app/cover-letters");
    } else {
      toast.error("Unable to save");
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[420px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Generate cover letter</CardTitle>
          <CardDescription>Paste the job description and optional notes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Job description</Label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the role description here"
            />
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Call out a specific project or outcome"
            />
          </div>
          <Button onClick={generate} disabled={loading || !jobDescription}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Editor</CardTitle>
          <CardDescription>Refine and save when ready.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Textarea
            className="min-h-[400px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="AI will place the first draft here..."
          />
          <div className="mt-3 flex gap-2">
            <Button onClick={saveCoverLetter} disabled={!content}>
              Save cover letter
            </Button>
            <Button variant="ghost" onClick={() => setContent((prev) => prev.slice(0, 500))}>
              Shorten
            </Button>
            <Button variant="ghost" onClick={() => setContent((prev) => `${prev}\n\nAdd more detail.`)}>
              Expand
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
