import { beforeEach, describe, expect, it } from "vitest";
import { clearDraft, loadDraft, saveDraft, saveResult, loadResult } from "@/lib/draftStorage";
import type { AssessmentResult } from "@/types/assessment";

beforeEach(() => {
  localStorage.clear();
});

describe("local draft storage", () => {
  it("saves and loads draft answers by session key", async () => {
    await saveDraft({ q1: 2, q2: 4 }, "TEAM42");

    await expect(loadDraft("TEAM42")).resolves.toEqual({ q1: 2, q2: 4 });
  });

  it("clears draft answers by session key", async () => {
    await saveDraft({ q1: 1 }, "personal");

    await clearDraft("personal");

    await expect(loadDraft("personal")).resolves.toEqual({});
  });

  it("ignores broken stored payloads", async () => {
    localStorage.setItem("assessment-draft:personal", "not-json");

    await expect(loadDraft("personal")).resolves.toEqual({});
    expect(localStorage.getItem("assessment-draft:personal")).toBeNull();
  });
});

describe("result storage", () => {
  const minimalResult: AssessmentResult = {
    overallScore: 30,
    totalScore: 30,
    maxScore: 64,
    completion: 100,
    scoreLevel: "Disciplined",
    categories: [],
  };

  it("saves and loads a result", () => {
    saveResult(minimalResult, { "p1-q1": 2 });

    const loaded = loadResult();
    expect(loaded?.result.totalScore).toBe(30);
    expect(loaded?.answers).toEqual({ "p1-q1": 2 });
    expect(loaded?.submittedAt).toBeDefined();
  });

  it("returns null when no result is stored", () => {
    expect(loadResult()).toBeNull();
  });

  it("returns null and removes key for broken payload", () => {
    localStorage.setItem("assessment-result", "not-json");

    expect(loadResult()).toBeNull();
    expect(localStorage.getItem("assessment-result")).toBeNull();
  });
});
