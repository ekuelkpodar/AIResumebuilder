type AtsBreakdown = {
  keywords: number;
  structure: number;
  bulletQuality: number;
  length: number;
};

export function computeAtsScore({
  resumeText,
  jobDescription,
}: {
  resumeText: string;
  jobDescription: string;
}): { score: number; breakdown: AtsBreakdown; missingKeywords: string[] } {
  const normalizedResume = resumeText.toLowerCase();
  const normalizedJD = jobDescription.toLowerCase();
  const jdKeywords = Array.from(
    new Set(
      normalizedJD
        .split(/[^a-zA-Z]/)
        .filter((word) => word.length > 4)
        .slice(0, 40),
    ),
  );

  const matches = jdKeywords.filter((kw) => normalizedResume.includes(kw));
  const missingKeywords = jdKeywords.filter((kw) => !normalizedResume.includes(kw)).slice(0, 10);

  const keywordScore = Math.min(100, Math.round((matches.length / jdKeywords.length) * 100));

  const hasStructure =
    /experience|work history/.test(normalizedResume) &&
    /education/.test(normalizedResume) &&
    /skills/.test(normalizedResume);
  const structureScore = hasStructure ? 90 : 60;

  const bulletQuality = /(\d+%?|\$?\d+)/.test(normalizedResume) ? 85 : 65;

  const lengthScore =
    normalizedResume.length > 3000
      ? 60
      : normalizedResume.length < 800
        ? 70
        : 90;

  const breakdown: AtsBreakdown = {
    keywords: keywordScore,
    structure: structureScore,
    bulletQuality,
    length: lengthScore,
  };

  const score = Math.round(
    (breakdown.keywords * 0.4 +
      breakdown.structure * 0.2 +
      breakdown.bulletQuality * 0.2 +
      breakdown.length * 0.2) /
      1,
  );

  return { score, breakdown, missingKeywords };
}
