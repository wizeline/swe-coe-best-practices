import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { assessmentTemplate } from "@/data/assessmentTemplate";
import { DashboardView } from "@/components/assessment/DashboardView";
import { LocalResult } from "@/lib/draftStorage";
import type { AssessmentResult } from "@/types/assessment";

const loadResult = vi.fn();

vi.mock("@/lib/draftStorage", () => ({
  loadResult: (...args: unknown[]) => loadResult(...args),
}));

function makeResult(): AssessmentResult {
  return {
    overallScore: 46,
    totalScore: 46,
    maxScore: 64,
    completion: 100,
    scoreLevel: "Optimized",
    categories: assessmentTemplate.categories.map((category) => ({
      id: category.id,
      title: category.title,
      score: 3,
      answered: category.questions.length,
      total: category.questions.length,
      weight: category.weight,
      suggestions: [],
    })),
  };
}

function makeLocalResult(overrides: Partial<LocalResult> = {}): LocalResult {
  const firstQuestion = assessmentTemplate.categories[0].questions[0];
  const secondQuestion = assessmentTemplate.categories[0].questions[1];
  return {
    result: makeResult(),
    answers: {
      [firstQuestion.id]: 3,
      [secondQuestion.id]: 2,
    },
    submittedAt: "2026-06-03T12:00:00.000Z",
    ...overrides,
  };
}

describe("DashboardView", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    loadResult.mockReset();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("shows empty state with link to assessment when no result in localStorage", async () => {
    loadResult.mockReturnValue(null);

    await act(async () => {
      root.render(<DashboardView />);
    });

    expect(container.textContent).toContain("Start assessment");
    expect(container.querySelector("a[href='/assessment']")).toBeDefined();
  });

  it("shows score card when a result exists in localStorage", async () => {
    loadResult.mockReturnValue(makeLocalResult());

    await act(async () => {
      root.render(<DashboardView />);
    });

    expect(container.textContent).toContain("Best Practices Self-Diagnostic Score");
    expect(container.textContent).toContain("46");
    expect(container.textContent).toContain("Optimized");
  });

  it("shows review answers button and renders read-only answers on click", async () => {
    loadResult.mockReturnValue(makeLocalResult());

    await act(async () => {
      root.render(<DashboardView />);
    });

    const reviewButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Review answers"
    );
    expect(reviewButton).toBeDefined();

    await act(async () => {
      reviewButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const firstQuestion = assessmentTemplate.categories[0].questions[0];
    expect(container.textContent).toContain("Answer Review");
    expect(container.textContent).toContain(firstQuestion.text);
  });

  it("hides review button when there are no questionnaire answers", async () => {
    loadResult.mockReturnValue(makeLocalResult({ answers: {} }));

    await act(async () => {
      root.render(<DashboardView />);
    });

    const reviewButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Review answers"
    );
    expect(reviewButton).toBeUndefined();
  });
});
