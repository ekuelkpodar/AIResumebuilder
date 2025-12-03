import { NextResponse } from "next/server";
import { aiSummarySchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = aiSummarySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const prompt = `User profile: ${JSON.stringify(parsed.data.userProfile)}\nResume snapshot: ${parsed.data.resumeSnapshot}\nTone: ${parsed.data.tone}\nWrite a 3-4 sentence professional summary.`;
    const ai = await callAI({
      systemPrompt: "You are crafting a concise professional resume summary.",
      userPrompt: prompt,
    });

    return NextResponse.json({ summary: ai.content.trim() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
