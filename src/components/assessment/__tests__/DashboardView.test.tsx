import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { assessmentTemplate } from "@/data/assessmentTemplate";
import { DashboardView } from "@/components/assessment/DashboardView";
import type { AssessmentResult, AssessmentSessionRecord, SubmissionRecord, TeamStats } from "@/types/assessment";

const push = vi.fn();
const loadUserSessions = vi.fn();
const getSessionByCode = vi.fn();
const getLatestSubmissionByEmail = vi.fn();
const loadTeamSubmissions = vi.fn();
const loadOrganizationCategoryAverages = vi.fn();
const buildTeamStats = vi.fn();
const createAssessmentSession = vi.fn();
const deleteAssessmentSession = vi.fn();

let currentSessionCode: string | null = null;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({
    get: (key: string) => (key === "session" ? currentSessionCode : null),
  }),
}));

vi.mock("@/components/charts", () => ({
  PillarRadarChart: () => <div>Radar Chart</div>,
}));

vi.mock("@/lib/storage", () => ({
  buildTeamStats: (...args: unknown[]) => buildTeamStats(...args),
  createAssessmentSession: (...args: unknown[]) => createAssessmentSession(...args),
  deleteAssessmentSession: (...args: unknown[]) => deleteAssessmentSession(...args),
  getLatestSubmissionByEmail: (...args: unknown[]) => getLatestSubmissionByEmail(...args),
  getSessionByCode: (...args: unknown[]) => getSessionByCode(...args),
  loadOrganizationCategoryAverages: (...args: unknown[]) => loadOrganizationCategoryAverages(...args),
  loadUserSessions: (...args: unknown[]) => loadUserSessions(...args),
  loadTeamSubmissions: (...args: unknown[]) => loadTeamSubmissions(...args),
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

function makeSubmission(overrides: Partial<SubmissionRecord> = {}): SubmissionRecord {
  const firstQuestion = assessmentTemplate.categories[0].questions[0];
  const secondQuestion = assessmentTemplate.categories[0].questions[1];

  return {
    id: "sub-1",
    email: "dev@example.com",
    answers: {
      [firstQuestion.id]: 3,
      [secondQuestion.id]: 2,
    },
    result: makeResult(),
    submittedAt: "2026-06-03T12:00:00.000Z",
    ...overrides,
  };
}

function makeSession(overrides: Partial<AssessmentSessionRecord> = {}): AssessmentSessionRecord {
  return {
    id: "session-1",
    code: "TEAM42",
    name: "Architecture Review",
    ownerEmail: "owner@example.com",
    createdAt: "2026-06-01T10:00:00.000Z",
    isOwner: false,
    isParticipant: true,
    ...overrides,
  };
}

function makeTeamStats(): TeamStats {
  return {
    totalSubmissions: 2,
    uniqueParticipants: 2,
    averageTotalScore: 40,
    maxTotalScore: 64,
    categoryAverages: Object.fromEntries(
      assessmentTemplate.categories.map((category) => [category.id, 3])
    ),
    categorySuggestions: {},
    submissionsByEmail: {},
  };
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
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
    currentSessionCode = null;

    push.mockReset();
    loadUserSessions.mockReset();
    getSessionByCode.mockReset();
    getLatestSubmissionByEmail.mockReset();
    loadTeamSubmissions.mockReset();
    loadOrganizationCategoryAverages.mockReset();
    buildTeamStats.mockReset();
    createAssessmentSession.mockReset();
    deleteAssessmentSession.mockReset();

    loadUserSessions.mockResolvedValue([]);
    getSessionByCode.mockResolvedValue(null);
    getLatestSubmissionByEmail.mockResolvedValue(makeSubmission());
    loadTeamSubmissions.mockResolvedValue([]);
    loadOrganizationCategoryAverages.mockResolvedValue({});
    buildTeamStats.mockReturnValue(makeTeamStats());
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("shows a review entry point and renders read-only answers for individual results", async () => {
    await act(async () => {
      root.render(<DashboardView userEmail="dev@example.com" initialSessionCode={null} />);
    });
    await flushEffects();

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
    expect(container.textContent).toContain("Selected: Optimized");

    const selectedInput = container.querySelector(
      `input[name='${firstQuestion.id}-review'][value='3']`
    ) as HTMLInputElement | null;

    expect(selectedInput?.checked).toBe(true);
    expect(selectedInput?.disabled).toBe(true);
  });

  it("shows the same review entry point for session-scoped personal results", async () => {
    const joinedSession = makeSession();
    currentSessionCode = joinedSession.code;
    loadUserSessions.mockResolvedValue([joinedSession]);
    getSessionByCode.mockResolvedValue(joinedSession);

    await act(async () => {
      root.render(
        <DashboardView userEmail="dev@example.com" initialSessionCode={joinedSession.code} />
      );
    });
    await flushEffects();

    expect(container.textContent).toContain("Personal results for team session");
    expect(container.textContent).toContain("Review answers");
  });

  it("does not expose personal answer review from the owner team overview", async () => {
    const ownerSession = makeSession({ isOwner: true, isParticipant: false, ownerEmail: "dev@example.com" });
    currentSessionCode = ownerSession.code;
    loadUserSessions.mockResolvedValue([ownerSession]);
    getSessionByCode.mockResolvedValue(ownerSession);
    getLatestSubmissionByEmail.mockResolvedValue(makeSubmission({ sessionCode: ownerSession.code }));
    loadTeamSubmissions.mockResolvedValue([makeSubmission({ sessionCode: ownerSession.code })]);
    loadOrganizationCategoryAverages.mockResolvedValue(
      Object.fromEntries(assessmentTemplate.categories.map((category) => [category.id, 3]))
    );

    await act(async () => {
      root.render(
        <DashboardView userEmail="dev@example.com" initialSessionCode={ownerSession.code} />
      );
    });
    await flushEffects();

    expect(container.textContent).toContain("Team Overview");
    expect(container.textContent).not.toContain("Review answers");
  });

  it("hides the review entry point when the latest result has no questionnaire answers", async () => {
    getLatestSubmissionByEmail.mockResolvedValue(makeSubmission({ answers: {} }));

    await act(async () => {
      root.render(<DashboardView userEmail="dev@example.com" initialSessionCode={null} />);
    });
    await flushEffects();

    expect(container.textContent).not.toContain("Review answers");
  });
});