"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Job = {
  id: string;
  title: string;
  company: string;
  status: string;
  notes?: string;
  location?: string;
};

const statuses = ["TO_APPLY", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"];

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    status: "TO_APPLY",
    location: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/job-tracker")
      .then((res) => res.json())
      .then((json) => setJobs(json.jobs ?? []));
  }, []);

  const grouped = useMemo(() => {
    return statuses.map((status) => ({
      status,
      items: jobs.filter((job) => job.status === status),
    }));
  }, [jobs]);

  const createJob = async () => {
    const res = await fetch("/api/job-tracker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error || "Unable to add job");
      return;
    }
    setJobs((prev) => [json.job, ...prev]);
    toast.success("Job added");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Job tracker</p>
          <h1 className="text-3xl font-semibold text-foreground">Pipeline overview</h1>
          <p className="text-muted-foreground">
            Organize applications, interviews, and offers in one view.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add an opportunity</CardTitle>
          <CardDescription>Track the basics now, refine later.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <div className="space-y-2 md:col-span-2">
            <Label>Role</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Product Manager"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Company</Label>
            <Input
              value={form.company}
              onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
              placeholder="Northwind"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(status) => setForm((prev) => ({ ...prev, status }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-5 space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Links, contacts, salary range, reminders..."
            />
          </div>
          <div className="md:col-span-5">
            <Button onClick={createJob}>
              <Plus className="mr-2 h-4 w-4" /> Add to tracker
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {grouped.map((column) => (
          <Card key={column.status}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {column.status.replace("_", " ").toLowerCase()}
                <Badge variant="secondary">{column.items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.items.length === 0 && (
                <p className="text-xs text-muted-foreground">No items in this stage.</p>
              )}
              {column.items.map((job) => (
                <div key={job.id} className="rounded-lg border p-3">
                  <p className="text-sm font-semibold">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                  {job.notes && <p className="mt-2 text-xs text-muted-foreground">{job.notes}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
