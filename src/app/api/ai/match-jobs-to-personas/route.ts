import { NextResponse } from "next/server";
import { aiMatchJobsSchema } from "@/lib/validators";
import { callAI } from "@/lib/ai-client";
import { simpleMatchScore } from "@/lib/matching";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

export async function POST(request: Request) {
  const rate = checkRateLimit("match-jobs", 15);
  if (!rate.allowed) return NextResponse.json({ error: { message: "Rate limited" } }, { status: 429 });
  try {
    const body = await request.json();
    const parsed = aiMatchJobsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: { message: "Invalid payload" } }, { status: 400 });

    // quick heuristic first
    const heuristic = parsed.data.jobLeads.flatMap((job) =>
      parsed.data.careerPersonas.map((persona) => ({
        jobLeadId: job.id,
        personaId: persona.id,
        matchScore: simpleMatchScore(job.title, persona.name),
        notes: "Heuristic match based on keywords.",
      })),
    );

    const prompt = `Personas: ${JSON.stringify(parsed.data.careerPersonas)}\nJob leads: ${JSON.stringify(parsed.data.jobLeads)}\nReturn JSON with matches array of {jobLeadId, personaId, matchScore, notes}`;
    const ai = await callAI({
      systemPrompt: "Rank job leads for personas. Keep scores 0-100 and concise notes. Return JSON.",
      userPrompt: prompt,
    });

    let matches = heuristic;
    try {
      const parsedAi = JSON.parse(ai.content);
      if (Array.isArray(parsedAi.matches)) {
        matches = parsedAi.matches;
      }
    } catch (e) {
      // fallback to heuristic
    }

    return NextResponse.json({ matches });
  } catch (error) {
    logError("match-jobs failed", { error: String(error) });
    return NextResponse.json({ error: { message: "AI error" } }, { status: 500 });
  }
}
