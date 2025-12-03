type AIRequest = {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
};

const AI_BASE_URL = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
const AI_MODEL = process.env.AI_MODEL ?? "gpt-4o-mini";

export async function callAI({ systemPrompt, userPrompt, model }: AIRequest) {
  if (!process.env.AI_API_KEY) {
    // Fallback for local dev so the UI still works.
    return {
      content: `AI key missing. Stub response based on prompt: ${userPrompt.slice(0, 120)}`,
    };
  }

  const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model ?? AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI request failed: ${response.status} ${body}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  return { content: content ?? "" };
}
