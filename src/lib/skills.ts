export function computeSkillCoverageScore(
  resumeSkills: string[],
  jobSkills: string[],
): { score: number; strong: string[]; weak: string[] } {
  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const jobSet = new Set(jobSkills.map((s) => s.toLowerCase()));
  const strong: string[] = [];
  const weak: string[] = [];

  jobSet.forEach((skill) => {
    if (resumeSet.has(skill)) strong.push(skill);
    else weak.push(skill);
  });

  const score = jobSet.size === 0 ? 100 : Math.round((strong.length / jobSet.size) * 100);
  return { score, strong, weak };
}
