import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("outreach", 20);
  if (!rate.allowed) return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  try {
    const body = await request.json();
    const { contactProfile, userCareerContext, purpose, channel } = body || {};
    if (!purpose) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    const prompt = `Contact: ${JSON.stringify(contactProfile)}\nUser: ${JSON.stringify(userCareerContext)}\nPurpose: ${purpose}\nChannel: ${channel}\nWrite a concise outreach message with an optional subject if email.`;
    const ai = await callAI({
      systemPrompt: "Draft concise, friendly outreach with clear ask and personalization.",
      userPrompt: prompt,
    });
    const parts = ai.content.split("\n\n");
    const subject = parts[0].toLowerCase().includes("subject:") ? parts[0].replace(/subject:/i, "").trim() : undefined;
    const bodyText = subject ? parts.slice(1).join("\n\n") : ai.content;
    return NextResponse.json({ subject, body: bodyText.trim() });
  } catch (error) {
    logError("outreach message failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
