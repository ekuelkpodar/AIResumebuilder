import { NextResponse } from "next/server";
import { aiCoverLetterSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = aiCoverLetterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const prompt = `Resume snapshot: ${parsed.data.resumeSnapshot}\nJob description: ${parsed.data.jobDescription}\nNotes: ${parsed.data.extraNotes ?? "None"}\nTone: ${parsed.data.tone}\nProduce a personalized cover letter.`;
    const ai = await callAI({
      systemPrompt: "You write concise, targeted cover letters with clear impact.",
      userPrompt: prompt,
    });

    return NextResponse.json({ coverLetter: ai.content.trim() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
