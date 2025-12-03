import { describe, expect, it } from "vitest";
import { simpleMatchScore } from "./matching";

describe("simpleMatchScore", () => {
  it("boosts matching keywords", () => {
    const score = simpleMatchScore("Product Manager", "Product persona");
    expect(score).toBeGreaterThan(60);
  });

  it("caps at 100", () => {
    const score = simpleMatchScore("Data Product", "Data Product");
    expect(score).toBeLessThanOrEqual(100);
  });
});
