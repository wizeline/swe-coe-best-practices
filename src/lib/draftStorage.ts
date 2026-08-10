import { AnswerMap, AssessmentResult } from "@/types/assessment";

const DRAFT_KEY_PREFIX = "assessment-draft:";
const RESULT_KEY = "assessment-result";

export interface LocalResult {
  result: AssessmentResult;
  answers: AnswerMap;
  submittedAt: string;
}

function getDraftKey(sessionKey: string): string {
  return `${DRAFT_KEY_PREFIX}${sessionKey.trim() || "personal"}`;
}

export async function saveDraft(answers: AnswerMap, sessionKey = "personal"): Promise<void> {
  const sanitizedAnswers = Object.fromEntries(
    Object.entries(answers).filter(([, value]) => value !== undefined)
  );

  localStorage.setItem(getDraftKey(sessionKey), JSON.stringify(sanitizedAnswers));
}

export async function loadDraft(sessionKey = "personal"): Promise<AnswerMap> {
  const stored = localStorage.getItem(getDraftKey(sessionKey));
  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored) as AnswerMap;
    return parsed ?? {};
  } catch {
    localStorage.removeItem(getDraftKey(sessionKey));
    return {};
  }
}

export async function clearDraft(sessionKey = "personal"): Promise<void> {
  localStorage.removeItem(getDraftKey(sessionKey));
}

export function saveResult(result: AssessmentResult, answers: AnswerMap): void {
  const payload: LocalResult = { result, answers, submittedAt: new Date().toISOString() };
  localStorage.setItem(RESULT_KEY, JSON.stringify(payload));
}

export function loadResult(): LocalResult | null {
  const stored = localStorage.getItem(RESULT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as LocalResult;
  } catch {
    localStorage.removeItem(RESULT_KEY);
    return null;
  }
}
