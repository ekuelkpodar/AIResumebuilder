"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CoverLetterDetailPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/cover-letters/${params?.id}`);
      if (res.ok) {
        const json = await res.json();
        setTitle(json.coverLetter.title);
        setContent(json.coverLetter.content);
      }
      setLoading(false);
    };
    load();
  }, [params?.id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/cover-letters/${params?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Saved");
    } else {
      toast.error("Unable to save");
    }
  };

  const regenerate = () => {
    setContent(
      `${content}\n\nRegenerated: Highlighted leadership impact and measurable outcomes.`,
    );
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit cover letter</CardTitle>
          <CardDescription>Refine the copy and save changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            className="min-h-[420px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
            <Button variant="ghost" onClick={regenerate}>
              <RefreshCw className="mr-2 h-4 w-4" /> Regenerate tone
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
