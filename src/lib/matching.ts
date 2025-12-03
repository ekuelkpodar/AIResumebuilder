export type MatchResult = {
  jobLeadId: string;
  personaId: string;
  matchScore: number;
  notes: string;
};

export function simpleMatchScore(jobTitle: string, personaName: string) {
  const title = jobTitle.toLowerCase();
  const persona = personaName.toLowerCase();
  let score = 50;
  if (title.includes("product") && persona.includes("product")) score += 20;
  if (title.includes("data") && persona.includes("data")) score += 20;
  return Math.min(100, score);
}
