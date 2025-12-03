import { NextResponse } from "next/server";
import { aiExtractSkillsSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";
import { computeSkillCoverageScore } from "@/lib/skills";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("extract-skills", 30);
  if (!rate.allowed) {
    return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = aiExtractSkillsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    }
    const prompt = `Extract concise skill list grouped by category. Resume: ${parsed.data.resumeText}\nJob description: ${parsed.data.jobDescription ?? "N/A"}`;
    const ai = await callAI({
      systemPrompt:
        "Extract skills from text. Return categories with skills, a flat list, and flag missing skills from the job description.",
      userPrompt: prompt,
    });

    // Basic parsing: split by lines and categories if present.
    const lines = ai.content.split("\n").map((l) => l.replace(/^[*-]\s?/, "").trim());
    const skillsDetected = Array.from(new Set(lines.filter(Boolean))).slice(0, 50);
    const skillCategories: Record<string, string[]> = {
      general: skillsDetected.slice(0, 20),
    };
    let missingSkills: string[] = [];
    if (parsed.data.jobDescription) {
      const jobTokens = parsed.data.jobDescription
        .toLowerCase()
        .split(/[^a-zA-Z]/)
        .filter((t) => t.length > 3);
      missingSkills = jobTokens
        .filter((token) => !skillsDetected.some((s) => s.toLowerCase().includes(token)))
        .slice(0, 10);
    }

    const coverage = computeSkillCoverageScore(
      skillsDetected,
      parsed.data.jobDescription ? missingSkills.concat(skillsDetected) : skillsDetected,
    );

    return NextResponse.json({
      skillsDetected,
      skillCategories,
      missingSkills,
      coverage,
    });
  } catch (error) {
    logError("extract skills failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
