import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { aiExtractUserSkillsSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";
import { authOptions } from "@/lib/auth";
import { normalizeCategory, upsertUserSkill } from "@/lib/skills-graph";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  const rate = checkRateLimit(`extract-user-skills:${session.user.id}`, 15);
  if (!rate.allowed) return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });

  try {
    const body = await request.json();
    const parsed = aiExtractUserSkillsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });

    const prompt = `Analyze resume and produce JSON array of skills with fields {name, category, suggestedProficiency, evidences}. Resume: ${parsed.data.resumeText}`;
    const ai = await callAI({
      systemPrompt: "Extract normalized skills with proficiency suggestions.",
      userPrompt: prompt,
    });

    let skills: any[] = [];
    try {
      const parsedAi = JSON.parse(ai.content);
      skills = parsedAi.skills ?? parsedAi ?? [];
    } catch {
      skills = ai.content
        .split("\n")
        .map((line) => line.replace(/^[*-]\s?/, "").trim())
        .filter(Boolean)
        .map((name) => ({ name, category: "TECHNICAL", suggestedProficiency: "INTERMEDIATE", evidences: [] }));
    }

    const tenantId = (session as any).tenantId ?? process.env.DEFAULT_TENANT_ID ?? "";
    if (!tenantId) {
      return NextResponse.json({ error: { message: "Tenant not resolved" } }, { status: 400 });
    }

    await Promise.all(
      skills.slice(0, 40).map(async (skill) => {
        await upsertUserSkill({
          userId: session.user.id,
          tenantId,
          name: skill.name,
          category: normalizeCategory(skill.category),
          proficiency: toProficiency(skill.suggestedProficiency),
          confidence: 0.7,
          source: "AI_INFERRED",
        });
      }),
    );

    return NextResponse.json({ skills });
  } catch (error) {
    logError("extract user skills failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}

function toProficiency(raw?: string) {
  const value = (raw ?? "").toLowerCase();
  if (value.includes("expert")) return "EXPERT";
  if (value.includes("advanced")) return "ADVANCED";
  if (value.includes("intermediate")) return "INTERMEDIATE";
  return "BEGINNER";
}
