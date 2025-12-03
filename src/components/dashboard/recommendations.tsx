"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Recommendations() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/analytics/ats-summary")
      .then(() => fetch("/api/resumes")) // ensure auth
      .catch(() => null);
    fetch("/api/analytics/job-status-summary").catch(() => null);
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((json) => setItems(json.recommendations ?? []))
      .catch(() => setItems([]));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Recommendations
          </CardTitle>
          <CardDescription>Actions tailored to your activity</CardDescription>
        </div>
        <Badge variant="secondary">Adaptive</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No suggestions yet.</p>}
        {items.map((item, idx) => (
          <div key={idx} className="rounded-md border bg-muted/30 p-3 text-sm">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
