import { NextResponse } from "next/server";
import { aiAtsSchema } from "@/lib/validators";
import { computeAtsScore } from "@/lib/ats";
import { computeSkillCoverageScore } from "@/lib/skills";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = aiAtsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { score, breakdown, missingKeywords } = computeAtsScore({
      resumeText: parsed.data.resumeText,
      jobDescription: parsed.data.jobDescription,
    });

    const resumeSkills = parsed.data.resumeText
      .split(/[^a-zA-Z]/)
      .filter((w) => w.length > 3)
      .slice(0, 80);
    const jobSkills = parsed.data.jobDescription
      .split(/[^a-zA-Z]/)
      .filter((w) => w.length > 3)
      .slice(0, 80);
    const coverage = computeSkillCoverageScore(resumeSkills, jobSkills);

    const suggestions = [
      "Add 2-3 keywords from the job description to your summary.",
      "Ensure each experience entry lists metrics or outcomes.",
      "Keep the resume under 2 pages for clarity.",
    ].slice(0, 3);

    return NextResponse.json({ score, breakdown, missingKeywords, suggestions, coverage });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "ATS check failed" }, { status: 500 });
  }
}
