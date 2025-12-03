"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

type AtsEntry = { title: string; atsScore: number; updatedAt: string };
type JobEntry = { status: string; count: number };

export default function InsightsPage() {
  const [atsData, setAtsData] = useState<AtsEntry[]>([]);
  const [jobData, setJobData] = useState<JobEntry[]>([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    fetch("/api/analytics/ats-summary")
      .then((res) => res.json())
      .then((json) => {
        setAverage(json.average ?? 0);
        setAtsData(
          (json.data ?? []).map((item: any) => ({
            title: item.title,
            atsScore: item.atsScore ?? 0,
            updatedAt: item.updatedAt,
          })),
        );
      });
    fetch("/api/analytics/job-status-summary")
      .then((res) => res.json())
      .then((json) => setJobData(json.data ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">Insights</p>
        <h1 className="text-3xl font-semibold">Performance & pipeline</h1>
        <p className="text-muted-foreground">Track ATS scores and job application progress.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ATS trend</CardTitle>
            <CardDescription>Average score: {average}</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={atsData}>
                <XAxis dataKey="title" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="atsScore" stroke="#0ea5e9" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Job status</CardTitle>
            <CardDescription>Applications by stage</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobData}>
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
