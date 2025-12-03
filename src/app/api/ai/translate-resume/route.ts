import { NextResponse } from "next/server";
import { aiTranslateSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("translate-resume", 20);
  if (!rate.allowed) {
    return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = aiTranslateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    }

    const prompt = `Translate this resume text while keeping structure intact. Target language: ${parsed.data.targetLanguage}. Tone: ${parsed.data.tone}. Resume:\n${parsed.data.resumeText}`;
    const ai = await callAI({
      systemPrompt:
        "You translate resumes while preserving structure and section labels. Return only translated text.",
      userPrompt: prompt,
    });

    return NextResponse.json({ translatedResumeText: ai.content.trim() });
  } catch (error) {
    logError("translate resume failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
