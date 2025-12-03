"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type JobLead = {
  id: string;
  title: string;
  company: string;
  status: string;
  link?: string;
};
type JobSource = { id: string; name: string; platform: string; searchUrl: string };
type Match = { jobLeadId: string; personaId: string; matchScore: number; notes: string };
type Persona = { id: string; name: string };

export default function JobsPage() {
  const [leads, setLeads] = useState<JobLead[]>([]);
  const [sources, setSources] = useState<JobSource[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leadForm, setLeadForm] = useState({
    title: "",
    company: "",
    link: "",
    location: "",
    rawData: "",
  });
  const [sourceForm, setSourceForm] = useState({
    name: "",
    platform: "custom",
    searchUrl: "",
  });

  const load = async () => {
    const l = await fetch("/api/job-leads").then((res) => res.json());
    setLeads(l.items ?? []);
    const s = await fetch("/api/job-sources").then((res) => res.json());
    setSources(s.items ?? []);
    const p = await fetch("/api/personas").then((res) => res.json());
    setPersonas(p.personas ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const createLead = async () => {
    const res = await fetch("/api/job-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadForm),
    });
    if (res.ok) {
      toast.success("Lead added");
      setLeadForm({ title: "", company: "", link: "", location: "", rawData: "" });
      load();
    } else toast.error("Could not add lead");
  };

  const createSource = async () => {
    const res = await fetch("/api/job-sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sourceForm, filters: {} }),
    });
    if (res.ok) {
      toast.success("Source saved");
      setSourceForm({ name: "", platform: "custom", searchUrl: "" });
      load();
    } else toast.error("Could not save source");
  };

  const runMatch = async () => {
    const res = await fetch("/api/ai/match-jobs-to-personas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        careerPersonas: personas,
        jobLeads: leads.map((l) => ({ id: l.id, title: l.title, company: l.company, description: "" })),
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setMatches(json.matches ?? []);
      toast.success("Match analysis ready");
    } else toast.error(json.error?.message ?? "Match failed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Job discovery</p>
          <h1 className="text-3xl font-semibold">Leads & sources</h1>
        </div>
        <Button variant="outline" onClick={runMatch}>
          Run match analysis
        </Button>
      </div>
      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add job lead</CardTitle>
              <CardDescription>Paste job info manually for now.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              <Input placeholder="Title" value={leadForm.title} onChange={(e) => setLeadForm((p) => ({ ...p, title: e.target.value }))} />
              <Input placeholder="Company" value={leadForm.company} onChange={(e) => setLeadForm((p) => ({ ...p, company: e.target.value }))} />
              <Input placeholder="Link" value={leadForm.link} onChange={(e) => setLeadForm((p) => ({ ...p, link: e.target.value }))} />
              <Input placeholder="Location" value={leadForm.location} onChange={(e) => setLeadForm((p) => ({ ...p, location: e.target.value }))} />
              <Textarea
                className="md:col-span-2"
                placeholder="Notes / raw description"
                value={leadForm.rawData}
                onChange={(e) => setLeadForm((p) => ({ ...p, rawData: e.target.value }))}
              />
              <Button onClick={createLead}>Save lead</Button>
            </CardContent>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            {leads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {lead.title} <Badge variant="secondary">{lead.status}</Badge>
                  </CardTitle>
                  <CardDescription>{lead.company}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/app/apply/${lead.id}`}>Prepare application</a>
                  </Button>
                  {lead.link && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={lead.link} target="_blank" rel="noreferrer">
                        View
                      </a>
                    </Button>
                  )}
                  {matches
                    .filter((m) => m.jobLeadId === lead.id)
                    .map((m) => (
                      <Badge key={m.personaId} variant="outline">
                        {m.matchScore}% • Persona {m.personaId.slice(0, 4)}
                      </Badge>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add source</CardTitle>
              <CardDescription>Save searches you monitor.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              <Input placeholder="Name" value={sourceForm.name} onChange={(e) => setSourceForm((p) => ({ ...p, name: e.target.value }))} />
              <Input
                placeholder="Platform"
                value={sourceForm.platform}
                onChange={(e) => setSourceForm((p) => ({ ...p, platform: e.target.value }))}
              />
              <Input
                className="md:col-span-2"
                placeholder="Search URL"
                value={sourceForm.searchUrl}
                onChange={(e) => setSourceForm((p) => ({ ...p, searchUrl: e.target.value }))}
              />
              <Button onClick={createSource}>Save source</Button>
            </CardContent>
          </Card>
          <div className="grid gap-3 md:grid-cols-2">
            {sources.map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <CardTitle>{source.name}</CardTitle>
                  <CardDescription>{source.platform}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a className="text-primary text-sm" href={source.searchUrl} target="_blank" rel="noreferrer">
                    Open search
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
