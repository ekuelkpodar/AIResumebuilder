import { NextResponse } from "next/server";
import { interviewQuestionGenSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("gen-questions", 15);
  if (!rate.allowed) return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  try {
    const body = await request.json();
    const parsed = interviewQuestionGenSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    const prompt = `Role: ${parsed.data.role}\nCategory: ${parsed.data.category}\nCount: ${parsed.data.count}\nReturn a bullet list of concise interview questions.`;
    const ai = await callAI({
      systemPrompt: "Generate concise, relevant interview questions.",
      userPrompt: prompt,
    });
    const questions = ai.content
      .split("\n")
      .map((q) => q.replace(/^[*-]\s?/, "").trim())
      .filter(Boolean)
      .slice(0, parsed.data.count);
    return NextResponse.json({ questions });
  } catch (error) {
    logError("generate interview questions failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
