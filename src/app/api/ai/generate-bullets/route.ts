import { NextResponse } from "next/server";
import { aiGenerateBulletsSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = aiGenerateBulletsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const prompt = `Role: ${parsed.data.roleTitle}\nCompany: ${parsed.data.company ?? ""}\nResponsibilities: ${parsed.data.responsibilities ?? ""}\nAchievements: ${parsed.data.achievements ?? ""}\nTone: ${parsed.data.tone}\nReturn 4 concise bullets in resume style.`;
    const ai = await callAI({
      systemPrompt: "You are an expert resume writer. Provide clear, metrics-driven bullet points.",
      userPrompt: prompt,
    });

    const bullets = ai.content
      .split("\n")
      .map((line) => line.replace(/^[*-]\s?/, "").trim())
      .filter(Boolean);

    return NextResponse.json({ bullets });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
