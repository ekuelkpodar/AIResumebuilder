"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Question = { text: string; id?: string };
type Story = { id: string; title: string; tags: string[] };

export default function InterviewsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [role, setRole] = useState("Product Manager");
  const [category, setCategory] = useState("BEHAVIORAL");
  const [stories, setStories] = useState<Story[]>([]);
  const [storyForm, setStoryForm] = useState({ title: "", tags: "" });

  const loadStories = async () => {
    // placeholder load from API when added
    setStories([
      { id: "1", title: "Led onboarding revamp", tags: ["leadership", "growth"] },
      { id: "2", title: "Resolved conflict in team", tags: ["conflict", "collaboration"] },
    ]);
  };

  useEffect(() => {
    loadStories();
  }, []);

  const generateQuestions = async () => {
    const res = await fetch("/api/ai/generate-interview-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, category, count: 3 }),
    });
    const json = await res.json();
    if (res.ok) {
      setQuestions((json.questions ?? []).map((q: string) => ({ text: q })));
    } else {
      toast.error(json.error?.message ?? "Unable to generate");
    }
  };

  const evaluate = async () => {
    const question = questions[0]?.text ?? "Tell me about yourself";
    const res = await fetch("/api/ai/evaluate-interview-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer: currentAnswer, role }),
    });
    const json = await res.json();
    if (res.ok) setFeedback(json);
    else toast.error(json.error?.message ?? "Could not evaluate");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Interview prep</p>
          <h1 className="text-3xl font-semibold">Practice & feedback</h1>
        </div>
        <Button onClick={generateQuestions}>Generate questions</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Practice</CardTitle>
            <CardDescription>Answer and get instant feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              {questions[0]?.text ?? "Click generate to load questions."}
            </div>
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="min-h-[160px]"
            />
            <Button onClick={evaluate}>Evaluate answer</Button>
            {feedback && (
              <div className="rounded-md border bg-muted/30 p-3 text-sm space-y-2">
                <p className="font-semibold">Score: {feedback.score}</p>
                <p>{feedback.feedbackSummary}</p>
                <p>Strengths: {(feedback.strengths ?? []).join(", ")}</p>
                <p>Improvements: {(feedback.improvements ?? []).join(", ")}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Story bank</CardTitle>
            <CardDescription>Keep STAR stories handy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Story title"
                value={storyForm.title}
                onChange={(e) => setStoryForm((p) => ({ ...p, title: e.target.value }))}
              />
              <Input
                placeholder="Tags"
                value={storyForm.tags}
                onChange={(e) => setStoryForm((p) => ({ ...p, tags: e.target.value }))}
              />
              <Button
                onClick={() => {
                  setStories((prev) => [...prev, { id: crypto.randomUUID(), title: storyForm.title, tags: storyForm.tags.split(",") }]);
                  setStoryForm({ title: "", tags: "" });
                }}
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {stories.map((story) => (
                <div key={story.id} className="rounded-md border p-3">
                  <p className="text-sm font-semibold">{story.title}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {story.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
