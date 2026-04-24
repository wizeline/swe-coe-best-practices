import { describe, expect, it } from "vitest";

import { parseHintBullets } from "@/lib/questionOptions";

describe("parseHintBullets", () => {
  it("extracts score-description pairs from the scoring guide format", () => {
    const parsed = parseHintBullets(
      "1 = Foundational behavior. · 2 = Disciplined behavior. · 3 = Optimized behavior. · 4 = Strategic behavior.",
    );

    expect(parsed).toEqual([
      { score: "1", description: "Foundational behavior." },
      { score: "2", description: "Disciplined behavior." },
      { score: "3", description: "Optimized behavior." },
      { score: "4", description: "Strategic behavior." },
    ]);
  });

  it("returns only valid score entries when malformed chunks exist", () => {
    const parsed = parseHintBullets("1 = First. · invalid chunk · 4 = Fourth.");

    expect(parsed).toEqual([
      { score: "1", description: "First." },
      { score: "4", description: "Fourth." },
    ]);
  });
});
