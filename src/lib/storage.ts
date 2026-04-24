import { assessmentTemplate } from "@/data/assessmentTemplate";
import {
  AnswerMap,
  AssessmentResult,
  LastResultRecord,
  SubmissionRecord,
  TeamStats,
} from "@/types/assessment";

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function saveDraft(answers: AnswerMap): Promise<void> {
  await requestJson("/api/drafts", {
    method: "PUT",
    body: JSON.stringify({ answers }),
  });
}

export async function loadDraft(): Promise<AnswerMap> {
  const result = await requestJson<{ answers: AnswerMap | null }>("/api/drafts");
  return result.answers ?? {};
}

export async function clearDraft(): Promise<void> {
  await requestJson("/api/drafts", {
    method: "DELETE",
  });
}

export async function saveLastResult(result: AssessmentResult): Promise<void> {
  await requestJson("/api/last-result", {
    method: "PUT",
    body: JSON.stringify({ result }),
  });
}

export async function loadLastResult(): Promise<LastResultRecord | null> {
  const result = await requestJson<{ data: LastResultRecord | null }>("/api/last-result");
  return result.data;
}

export async function addSubmission(
  answers: AnswerMap,
  result: AssessmentResult,
): Promise<SubmissionRecord> {
  return requestJson<SubmissionRecord>("/api/submissions", {
    method: "POST",
    body: JSON.stringify({ answers, result }),
  });
}

export async function loadAllSubmissions(): Promise<SubmissionRecord[]> {
  return requestJson<SubmissionRecord[]>("/api/submissions");
}

export async function getSubmissionsByEmail(): Promise<SubmissionRecord[]> {
  return requestJson<SubmissionRecord[]>("/api/submissions");
}

export async function getLatestSubmissionByEmail(): Promise<SubmissionRecord | null> {
  return requestJson<SubmissionRecord | null>("/api/submissions?latest=true");
}

export function buildTeamStats(submissions: SubmissionRecord[]): TeamStats {
  const submissionsByEmail: Record<string, SubmissionRecord[]> = {};

  submissions.forEach((sub) => {
    if (!submissionsByEmail[sub.email]) {
      submissionsByEmail[sub.email] = [];
    }
    submissionsByEmail[sub.email].push(sub);
  });

  const totalScores = submissions.map((s) => s.result.totalScore);
  const averageTotalScore =
    totalScores.length > 0
      ? Number((totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(1))
      : 0;

  const maxTotalScore = submissions[0]?.result.maxScore ?? assessmentTemplate.categories.reduce(
    (acc, category) => acc + category.questions.length * 4,
    0,
  );

  const categoryAverages: Record<string, number> = {};
  if (submissions.length > 0) {
    const categoryCount = submissions[0].result.categories.length;
    for (let i = 0; i < categoryCount; i++) {
      const categoryScores = submissions.map((s) => s.result.categories[i].score);
      const categoryId = submissions[0].result.categories[i].id;
      categoryAverages[categoryId] = Number(
        (categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length).toFixed(2),
      );
    }
  }

  return {
    totalSubmissions: submissions.length,
    uniqueParticipants: Object.keys(submissionsByEmail).length,
    averageTotalScore,
    maxTotalScore,
    categoryAverages,
    submissionsByEmail,
  };
}

export async function getTeamStats(): Promise<TeamStats> {
  const submissions = await loadAllSubmissions();
  return buildTeamStats(submissions);
}

export async function deleteSubmission(id: string): Promise<void> {
  await requestJson(`/api/submissions/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
