"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Portfolio = { id: string; title: string; slug: string; headline?: string };

export default function PortfolioPage() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [form, setForm] = useState({ title: "My Portfolio", slug: "my-portfolio", headline: "" });

  const load = async () => {
    const res = await fetch("/api/portfolios");
    const json = await res.json();
    setItems(json.items ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const res = await fetch("/api/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sections: {}, themeConfig: {} }),
    });
    if (res.ok) {
      toast.success("Portfolio created");
      load();
    } else toast.error("Could not create");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Portfolio</p>
          <h1 className="text-3xl font-semibold">Showcase your work</h1>
        </div>
        <Button onClick={create}>Create from resume</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New portfolio</CardTitle>
          <CardDescription>AI-assisted creation available via resume snapshot.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
          <Textarea
            className="md:col-span-3"
            placeholder="Headline / bio"
            value={form.headline}
            onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
          />
        </CardContent>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.headline}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" asChild>
                <a href={`/p/${item.slug}`} target="_blank" rel="noreferrer">
                  View public
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
