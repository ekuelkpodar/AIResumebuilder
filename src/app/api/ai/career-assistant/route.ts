import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aiCareerAssistantSchema } from "@/lib/validators";
import { buildCareerContext } from "@/lib/ai/career-context";
import { callAI } from "@/lib/ai-client";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";
import { isFeatureEnabled } from "@/lib/feature-flags";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
  }

  if (!(await isFeatureEnabled(session.user.id, "careerAssistant"))) {
    return NextResponse.json({ error: { message: "Career assistant disabled" } }, { status: 403 });
  }

  const rate = checkRateLimit(`career:${session.user.id}`, 15);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: { message: "Too many requests, try again soon." } },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = aiCareerAssistantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });
    }

    const context = await buildCareerContext(session.user.id);
    const prompt = `Career context JSON:\n${JSON.stringify(context)}\nQuestion: ${
      parsed.data.question
    }\nProvide actionable, concise guidance.`;

    const ai = await callAI({
      systemPrompt:
        "You are a career coach that provides concise, actionable guidance tailored to the user's background.",
      userPrompt: prompt,
    });

    const answer = ai.content.trim();
    const suggestedActions = answer
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 5);

    return NextResponse.json({ answer, suggestedActions });
  } catch (error) {
    logError("Career assistant failure", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
