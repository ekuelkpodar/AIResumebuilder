import Link from "next/link";
import { CheckCircle, Sparkles, ShieldCheck, LayoutPanelTop, Rocket, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: Sparkles,
    title: "AI Resume Writer",
    description:
      "Draft impact-focused bullets, summaries, and STAR stories based on your role and achievements.",
  },
  {
    icon: ShieldCheck,
    title: "ATS Resume Checker",
    description:
      "Instantly spot missing keywords and formatting issues before you apply.",
  },
  {
    icon: LayoutPanelTop,
    title: "Beautiful Templates",
    description: "Modern one- and two-column templates tailored for different industries.",
  },
  {
    icon: Rocket,
    title: "Job Tracker",
    description: "Stay organized with a light CRM for applications, interviews, and offers.",
  },
];

const howItWorks = [
  "Pick a template or start blank.",
  "Add experience, projects, and skills with inline AI help.",
  "Tailor to a job description and run the ATS check.",
  "Export, apply, and track your pipeline.",
];

const faqs = [
  {
    q: "Is ResumeCraft ATS-friendly?",
    a: "Yes. Our layouts avoid heavy graphics and keep parsing clean for applicant tracking systems.",
  },
  {
    q: "Do I need an AI key?",
    a: "No. AI is built in. Bring your own key if you prefer via environment variables.",
  },
  {
    q: "Can I import my current resume?",
    a: "You can upload a PDF or DOCX and we will prefill sections with a lightweight parser.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Build one resume and cover letter, then upgrade for unlimited usage and full ATS checks.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            New: Inline AI actions + ATS scoring
          </Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
            Build a resume that actually gets interviews.
          </h1>
          <p className="text-lg text-muted-foreground">
            ResumeCraft combines AI writing, ATS checks, and a job tracker so you can go from draft
            to tailored application in minutes.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Build your resume</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/app/ats-checker">Try free ATS check</Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Trusted by 12k+ candidates</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <span>Privacy-first by design</span>
            </div>
          </div>
        </div>
        <Card className="border-0 bg-gradient-to-br from-white via-sky-50 to-slate-50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">A focused builder experience</CardTitle>
            <CardDescription>
              Live preview, section editor, and inline AI in one clean workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed bg-white/60 p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Resume Preview</p>
                  <p className="text-xs text-muted-foreground">Minimal Focus • ATS ready</p>
                </div>
                <Badge>2-column</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="rounded-md bg-muted p-2 text-xs font-semibold">Sections</div>
                  {["Header", "Summary", "Experience", "Skills", "Projects"].map((item) => (
                    <div key={item} className="rounded-md border bg-white p-2 text-xs">
                      {item}
                    </div>
                  ))}
                  <Button size="sm" variant="secondary" className="w-full">
                    Add section
                  </Button>
                </div>
                <div className="col-span-2 space-y-3 rounded-md border bg-white p-3 shadow-inner">
                  <div className="space-y-1">
                    <div className="h-3 w-24 rounded bg-muted" />
                    <div className="h-3 w-48 rounded bg-muted" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="h-3 w-44 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-5/6 rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </div>
                  <Card className="border-sky-100 bg-sky-50">
                    <CardContent className="flex items-center gap-3 p-3">
                      <Sparkles className="h-4 w-4 text-sky-600" />
                      <div>
                        <p className="text-sm font-semibold text-sky-900">AI suggestion</p>
                        <p className="text-xs text-sky-800">
                          “Increased qualified leads by 34% through revamped onboarding flows.”
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="hover:translate-y-[-2px] transition-transform">
              <CardHeader className="flex flex-row items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <section className="rounded-2xl border bg-white/70 p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">How it works</p>
            <h2 className="text-2xl font-semibold text-foreground">From draft to download</h2>
            <p className="text-sm text-muted-foreground">
              A guided flow that keeps you focused and saves hours of editing.
            </p>
          </div>
          <Button asChild>
            <Link href="/register">Start now</Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {howItWorks.map((step, idx) => (
            <Card key={step} className="border-dashed bg-secondary/50">
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {idx + 1}
                </div>
                <p className="text-sm text-foreground">{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Template gallery</CardTitle>
            <CardDescription>Switch styles without losing your content.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {["Minimal", "Modern", "Classic", "Creative"].map((name) => (
              <div key={name} className="rounded-lg border bg-muted/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">{name}</p>
                  <Badge variant="outline">Popular</Badge>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• One & two column layouts</p>
                  <p>• Accent color controls</p>
                  <p>• Typography presets</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button variant="ghost" asChild>
              <Link href="/templates">View templates</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-gradient-to-br from-sky-600 to-cyan-500 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Inline AI for every section</CardTitle>
            <CardDescription className="text-slate-100">
              Choose tone, rewrite in STAR format, and tailor to a job description instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white/10 p-3 text-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/70">
                <Sparkles className="h-3.5 w-3.5" /> AI Rewrite
              </div>
              <p className="mt-2">
                “Reduced onboarding time by 28% by launching guided product tours and live chat.”
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-3 text-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/70">
                <FileText className="h-3.5 w-3.5" /> Job-tailored
              </div>
              <p className="mt-2">
                “Matched 93% of target keywords for the Growth PM role at Northwind Labs.”
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Frequently asked</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
                <CardDescription>{item.a}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-white/70 p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-primary">Ready to upgrade your job search?</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Build a polished, ATS-ready resume with ResumeCraft.
        </h3>
        <div className="mt-6 flex justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/register">Get started free</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
