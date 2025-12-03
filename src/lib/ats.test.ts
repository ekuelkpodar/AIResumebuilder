import { describe, expect, it } from "vitest";
import { computeAtsScore } from "./ats";

describe("computeAtsScore", () => {
  it("returns higher score when keywords match", () => {
    const jd = "We need a product manager with SQL and experimentation experience";
    const resume = "Product manager skilled in SQL, experimentation, and growth.";
    const result = computeAtsScore({ resumeText: resume, jobDescription: jd });
    expect(result.score).toBeGreaterThan(60);
    expect(result.breakdown.keywords).toBeGreaterThan(50);
  });

  it("returns missing keywords list", () => {
    const jd = "Engineer who knows Kubernetes and Go and distributed systems";
    const resume = "Engineer working on web applications";
    const result = computeAtsScore({ resumeText: resume, jobDescription: jd });
    expect(result.missingKeywords.length).toBeGreaterThan(0);
  });
});
