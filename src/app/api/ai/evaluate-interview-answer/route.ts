import { NextResponse } from "next/server";
import { interviewAnswerSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("eval-answer", 20);
  if (!rate.allowed) return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  try {
    const body = await request.json();
    const parsed = interviewAnswerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    const prompt = `Question: ${parsed.data.question}\nAnswer: ${parsed.data.answer}\nRole: ${parsed.data.role ?? "general"}\nProvide feedback summary, strengths, improvements and a score 0-100 in JSON.`;
    const ai = await callAI({
      systemPrompt: "You are an interview coach. Be concise, constructive, and specific.",
      userPrompt: prompt,
    });
    let feedback;
    try {
      feedback = JSON.parse(ai.content);
    } catch {
      feedback = {
        feedbackSummary: ai.content.slice(0, 400),
        strengths: [],
        improvements: [],
        score: 70,
      };
    }
    return NextResponse.json(feedback);
  } catch (error) {
    logError("evaluate interview answer failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
