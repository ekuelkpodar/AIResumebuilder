import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("portfolio-gen", 10);
  if (!rate.allowed) return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  try {
    const body = await request.json();
    const { resumeSnapshot, persona } = body || {};
    if (!resumeSnapshot) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    const prompt = `Resume: ${resumeSnapshot}\nPersona: ${persona ?? "General"}\nReturn JSON with portfolioTitle, headline, bio, projects [{title, summary, role, technologies, impactPoints}]`;
    const ai = await callAI({
      systemPrompt: "Create a portfolio outline based on the resume. Keep content concise and measurable.",
      userPrompt: prompt,
    });
    let response;
    try {
      response = JSON.parse(ai.content);
    } catch {
      response = { portfolioTitle: "Portfolio", headline: "", bio: ai.content.slice(0, 300), projects: [] };
    }
    return NextResponse.json(response);
  } catch (error) {
    logError("portfolio generation failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
