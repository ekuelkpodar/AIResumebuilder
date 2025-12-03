"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sparkles, RefreshCw, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ResumePreview } from "@/components/resume/resume-preview";
import { toast } from "sonner";

type ResumeData = {
  summary?: string;
  skills?: string[];
  experience?: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
};

const initialData: ResumeData = {
  summary: "Product generalist with experience shipping onboarding, growth, and ops tooling.",
  skills: ["Product strategy", "User research", "SQL", "Roadmapping"],
  experience: [
    {
      role: "Product Manager",
      company: "Northwind Labs",
      period: "2022 - Present",
      bullets: [
        "Led onboarding overhaul that improved activation by 18%.",
        "Launched in-app nudges that increased self-serve revenue by 14%.",
      ],
    },
  ],
};

export default function ResumeBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState({
    id: params?.id as string,
    title: "Untitled resume",
    data: initialData,
    atsScore: undefined as number | undefined,
    language: "en",
  });
  const [optimizeForm, setOptimizeForm] = useState({ role: "Product Manager", country: "US" });
  const [translateLang, setTranslateLang] = useState("fr");
  const [sections, setSections] = useState(["Summary", "Experience", "Skills"]);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchResume = async () => {
      const res = await fetch(`/api/resumes/${params?.id}`);
      if (res.ok) {
        const json = await res.json();
        setResume({
          id: json.resume.id,
          title: json.resume.title,
          data: json.resume.data ?? initialData,
          atsScore: json.resume.atsScore ?? undefined,
          language: json.resume.language ?? "en",
        });
      }
      setLoading(false);
    };
    fetchResume();
  }, [params?.id]);

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => {
      saveResume();
    }, 1500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume]);

  const saveResume = async () => {
    setSaving(true);
    await fetch(`/api/resumes/${resume.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: resume.title,
        data: resume.data,
        atsScore: resume.atsScore,
        language: resume.language,
      }),
    });
    setSaving(false);
  };

  const handleAIGenerateBullets = async (experienceIndex: number) => {
    const exp = resume.data.experience?.[experienceIndex];
    if (!exp) return;
    const res = await fetch("/api/ai/generate-bullets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roleTitle: exp.role,
        company: exp.company,
        responsibilities: "Product ownership, roadmap, launch execution",
        achievements: exp.bullets.join(" "),
        tone: "Professional",
      }),
    });
    const json = await res.json();
    setResume((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        experience: prev.data.experience?.map((item, idx) =>
          idx === experienceIndex ? { ...item, bullets: json.bullets ?? item.bullets } : item,
        ),
      },
    }));
    toast.success("AI bullets added");
  };

  const handleImproveSummary = async () => {
    const snapshot =
      resume.data.summary && resume.data.summary.length > 0
        ? resume.data.summary
        : "Experienced professional looking to highlight achievements.";
    const res = await fetch("/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userProfile: {},
        resumeSnapshot: snapshot,
        tone: "Professional",
      }),
    });
    const json = await res.json();
    setResume((prev) => ({ ...prev, data: { ...prev.data, summary: json.summary } }));
    toast.success("Summary improved");
  };

  const handleAtsCheck = async () => {
    const resumeText = `${resume.title} ${resume.data.summary} ${resume.data.experience
      ?.map((exp) => `${exp.role} ${exp.company} ${exp.bullets.join(" ")}`)
      .join(" ")}`;
    const res = await fetch("/api/ai/ats-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeText,
        jobDescription: "Growth-oriented PM role working on activation and monetization.",
      }),
    });
    const json = await res.json();
    setResume((prev) => ({ ...prev, atsScore: json.score }));
    toast.success(`ATS score updated: ${json.score}`);
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sectionItems = useMemo(
    () => sections.map((id) => ({ id, label: id })),
    [sections],
  );

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading resume...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Resume builder</p>
          <h1 className="text-3xl font-semibold text-foreground">{resume.title}</h1>
          <p className="text-sm text-muted-foreground">Reorder sections, edit content, and use AI.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">ATS {resume.atsScore ?? "—"}</Badge>
          <Button variant="outline" onClick={handleAtsCheck}>
            <RefreshCw className="mr-2 h-4 w-4" /> Run ATS check
          </Button>
          <Button onClick={() => router.push(`/api/resumes/${resume.id}/pdf`)} variant="secondary">
            Download PDF
          </Button>
          <Button onClick={() => router.push(`/api/resumes/${resume.id}/docx`)} variant="outline">
            Download DOCX
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              const res = await fetch(`/api/resumes/${resume.id}/share`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enable: true }),
              });
              const json = await res.json();
              if (res.ok && json.shareToken) {
                navigator.clipboard.writeText(`${window.location.origin}/r/${json.shareToken}`);
                toast.success("Public link copied");
              } else {
                toast.error(json.error?.message ?? "Share failed");
              }
            }}
          >
            Share
          </Button>
          <Button disabled={saving} variant="outline">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Saved"
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px,1fr,360px]">
        <Card>
          <CardHeader>
            <CardTitle>Sections</CardTitle>
            <CardDescription>Drag to reorder</CardDescription>
          </CardHeader>
          <CardContent>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={sectionItems} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {sectionItems.map((item) => (
                    <SortableSection key={item.id} id={item.id} label={item.label} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <ResumePreview title={resume.title} data={resume.data} accent="#0ea5e9" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
            <CardDescription>Update content and trigger AI suggestions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={resume.language}
                onChange={(e) => setResume((prev) => ({ ...prev, language: e.target.value }))}
              >
                {["en", "fr", "es", "de"].map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Input
                  value={translateLang}
                  onChange={(e) => setTranslateLang(e.target.value)}
                  placeholder="fr"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const text = `${resume.title}\n${resume.data.summary ?? ""}\n${resume.data.experience
                      ?.map((exp) => `${exp.role} ${exp.company} ${(exp.bullets ?? []).join(" ")}`)
                      .join("\n")}`;
                    const res = await fetch("/api/ai/translate-resume", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        resumeText: text,
                        targetLanguage: translateLang,
                        tone: "Professional",
                      }),
                    });
                    const json = await res.json();
                    if (res.ok) {
                      toast.success("Translated summary");
                      setResume((prev) => ({
                        ...prev,
                        language: translateLang,
                        data: { ...prev.data, summary: json.translatedResumeText },
                      }));
                    } else {
                      toast.error(json.error?.message ?? "Translate failed");
                    }
                  }}
                >
                  Translate
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea
                value={resume.data.summary ?? ""}
                onChange={(e) =>
                  setResume((prev) => ({ ...prev, data: { ...prev.data, summary: e.target.value } }))
                }
              />
              <Button variant="ghost" size="sm" onClick={handleImproveSummary}>
                <Sparkles className="mr-2 h-4 w-4" /> Ask AI to improve
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Skills (comma separated)</Label>
              <Input
                value={resume.data.skills?.join(", ") ?? ""}
                onChange={(e) =>
                  setResume((prev) => ({
                    ...prev,
                    data: { ...prev.data, skills: e.target.value.split(",").map((s) => s.trim()) },
                  }))
                }
              />
            </div>

            {resume.data.experience?.map((exp, idx) => (
              <div key={idx} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{exp.role}</p>
                    <p className="text-xs text-muted-foreground">{exp.company}</p>
                  </div>
                  <Badge variant="secondary">{exp.period}</Badge>
                </div>
                <div className="mt-2 space-y-2">
                  {exp.bullets.map((bullet, bulletIdx) => (
                    <Textarea
                      key={bulletIdx}
                      value={bullet ?? ""}
                      onChange={(e) =>
                        setResume((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            experience: prev.data.experience?.map((item, itemIdx) =>
                              itemIdx === idx
                                ? {
                                    ...item,
                                    bullets: item.bullets.map((b, bIdx) =>
                                      bIdx === bulletIdx ? e.target.value : b,
                                    ),
                                  }
                                : item,
                            ),
                          },
                        }))
                      }
                    />
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleAIGenerateBullets(idx)}>
                    <Wand2 className="mr-2 h-4 w-4" /> Generate bullets
                  </Button>
                </div>
              </div>
            ))}

            <div className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Optimize for role & country</p>
                <Badge variant="secondary">AI</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <Label>Role</Label>
                  <Input
                    value={optimizeForm.role}
                    onChange={(e) => setOptimizeForm((p) => ({ ...p, role: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={optimizeForm.country}
                    onChange={(e) => setOptimizeForm((p) => ({ ...p, country: e.target.value }))}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const text = `${resume.title} ${resume.data.summary ?? ""} ${resume.data.experience
                    ?.map((exp) => `${exp.role} ${exp.company} ${(exp.bullets ?? []).join(" ")}`)
                    .join(" ")}`;
                  const res = await fetch("/api/ai/optimize-for-role", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      resumeText: text,
                      targetRoleTitle: optimizeForm.role,
                      country: optimizeForm.country,
                    }),
                  });
                  const json = await res.json();
                  if (res.ok) {
                    toast.success("Optimized for role");
                    setResume((prev) => ({
                      ...prev,
                      data: { ...prev.data, summary: json.optimizedResumeText },
                    }));
                  } else {
                    toast.error(json.error?.message ?? "Optimization failed");
                  }
                }}
              >
                <Wand2 className="mr-2 h-4 w-4" /> Optimize
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const res = await fetch(`/api/resumes/${resume.id}/versions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ label: "Manual save" }),
                  });
                  if (res.ok) toast.success("Version saved");
                }}
              >
                Save version
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SortableSection({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-foreground shadow-sm"
    >
      <span>{label}</span>
      <span className="text-xs text-muted-foreground">Drag</span>
    </div>
  );
}
