import { NextResponse } from "next/server";
import { aiOptimizeRoleSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("optimize-role", 15);
  if (!rate.allowed) {
    return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  }
  try {
    const body = await request.json();
    const parsed = aiOptimizeRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    }
    const prompt = `Resume text:\n${parsed.data.resumeText}\nTarget role: ${parsed.data.targetRoleTitle}\nCountry: ${parsed.data.country}\nRewrite to match expectations in that market. Return optimized text followed by a bullet list of notes.`;
    const ai = await callAI({
      systemPrompt:
        "You are an expert resume editor optimizing for specific roles and countries. Keep ATS-friendly formatting.",
      userPrompt: prompt,
    });
    const parts = ai.content.split("\n- ").filter(Boolean);
    const optimizedResumeText = parts.shift()?.trim() ?? ai.content.trim();
    const notes = parts.map((p) => p.trim()).slice(0, 6);
    return NextResponse.json({ optimizedResumeText, notes });
  } catch (error) {
    logError("optimize role failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
