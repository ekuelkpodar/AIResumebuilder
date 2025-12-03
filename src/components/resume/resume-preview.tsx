"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Experience = {
  role: string;
  company: string;
  period?: string;
  bullets?: string[];
};

type ResumeData = {
  summary?: string;
  experience?: Experience[];
  skills?: string[];
  education?: { school: string; degree?: string; period?: string }[];
};

type Props = {
  title: string;
  data: ResumeData;
  layout?: any;
  accent?: string;
};

export function ResumePreview({ title, data, accent = "#0ea5e9" }: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {data.summary && <p className="text-sm text-muted-foreground">{data.summary}</p>}
        </div>
        <Badge variant="outline" style={{ borderColor: accent, color: accent }}>
          ATS friendly
        </Badge>
      </div>
      <div className="mt-4 space-y-4 text-sm text-foreground">
        {data.experience && data.experience.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Experience
            </h4>
            <div className="mt-2 space-y-3">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="rounded-md border border-dashed p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{exp.role}</p>
                    <span className="text-xs text-muted-foreground">
                      {exp.company} • {exp.period}
                    </span>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
                    {exp.bullets?.map((bullet, bulletIdx) => (
                      <li key={bulletIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills && data.skills.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Skills
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs",
                    "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.education && data.education.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Education
            </h4>
            <div className="mt-2 space-y-2">
              {data.education.map((edu, idx) => (
                <div key={idx} className="rounded-md border border-dashed p-3">
                  <p className="font-semibold">{edu.school}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.degree} • {edu.period}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
