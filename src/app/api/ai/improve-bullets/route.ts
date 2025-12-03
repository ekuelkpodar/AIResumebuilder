import { NextResponse } from "next/server";
import { aiImproveBulletsSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = aiImproveBulletsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const prompt = `Current bullets:\n${parsed.data.existingBullets
      .map((b) => `- ${b}`)
      .join("\n")}\nTone: ${parsed.data.tone}\nOptions: ${JSON.stringify(parsed.data.styleOptions)}\nRewrite with STAR framing when relevant. Return bullets only.`;
    const ai = await callAI({
      systemPrompt: "Rewrite resume bullets to be concise and impactful.",
      userPrompt: prompt,
    });

    const improvedBullets = ai.content
      .split("\n")
      .map((line) => line.replace(/^[*-]\s?/, "").trim())
      .filter(Boolean);

    return NextResponse.json({ improvedBullets });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
