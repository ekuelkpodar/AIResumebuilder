import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("recruiter-feedback", 15);
  if (!rate.allowed) return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  try {
    const body = await request.json();
    const { jobDescription, resumeText } = body || {};
    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    }
    const prompt = `Job description: ${jobDescription}\nResume: ${resumeText}\nReturn JSON with summaryFit, concerns[], questionsToAsk[], fitScore 0-100`;
    const ai = await callAI({
      systemPrompt: "You assist recruiters by summarizing fit and key concerns concisely.",
      userPrompt: prompt,
    });
    let response;
    try {
      response = JSON.parse(ai.content);
    } catch {
      response = {
        summaryFit: ai.content.slice(0, 300),
        concerns: [],
        questionsToAsk: [],
        fitScore: 70,
      };
    }
    return NextResponse.json(response);
  } catch (error) {
    logError("recruiter feedback failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
