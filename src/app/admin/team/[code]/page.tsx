import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildAdminReportHrefWithPage, buildTeamDetail, isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getScoreLevel } from "@/lib/scoring";
import {
  AdminSessionFilters,
  AdminSessionSort,
  AnswerMap,
  AssessmentResult,
  SubmissionRecord,
} from "@/types/assessment";

interface AdminTeamDetailPageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ from?: string; to?: string; sort?: string; page?: string }>;
}

const allowedSorts: AdminSessionSort[] = ["created-desc", "created-asc", "score-desc", "score-asc"];

function normalizeSort(value?: string): AdminSessionSort {
  return allowedSorts.includes(value as AdminSessionSort)
    ? (value as AdminSessionSort)
    : "created-desc";
}

function normalizePage(value?: string): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function toSubmissionRecord(data: {
  id: string;
  email: string;
  sessionId: string | null;
  totalScore: number | null;
  maxScore: number | null;
  completion: number | null;
  scoreLevel: string | null;
  answers?: Prisma.JsonValue | null;
  result: Prisma.JsonValue;
  submittedAt: Date;
  session?: {
    code: string;
    name: string;
  } | null;
}): SubmissionRecord {
  const parsedResult = data.result as unknown as Partial<AssessmentResult>;
  const totalScore = data.totalScore ?? parsedResult.totalScore ?? 0;
  const maxScore = data.maxScore ?? parsedResult.maxScore ?? 0;
  const completion = data.completion ?? parsedResult.completion ?? 0;
  const scoreLevel = getScoreLevel(totalScore, maxScore);

  return {
    id: data.id,
    email: data.email,
    sessionId: data.sessionId,
    sessionCode: data.session?.code ?? null,
    sessionName: data.session?.name ?? null,
    totalScore,
    maxScore,
    completion,
    scoreLevel,
    answers: (data.answers ?? {}) as unknown as AnswerMap,
    result: {
      ...(parsedResult as AssessmentResult),
      totalScore,
      maxScore,
      completion,
      scoreLevel,
    },
    submittedAt: data.submittedAt.toISOString(),
  };
}

export default async function AdminTeamDetailPage({
  params,
  searchParams,
}: AdminTeamDetailPageProps) {
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase().trim();
  const routeParams = await params;
  const queryParams = await searchParams;

  const filters: AdminSessionFilters = {
    fromDate: queryParams.from,
    toDate: queryParams.to,
    sort: normalizeSort(queryParams.sort),
  };
  const page = normalizePage(queryParams.page);

  if (!userEmail) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!isAdminEmail(userEmail)) {
    redirect("/dashboard");
  }

  const code = routeParams.code.trim().toUpperCase();

  const assessmentSession = await prisma.assessmentSession.findUnique({
    where: { code },
    include: {
      submissions: {
        select: {
          id: true,
          email: true,
          sessionId: true,
          totalScore: true,
          maxScore: true,
          completion: true,
          scoreLevel: true,
          result: true,
          submittedAt: true,
        },
        orderBy: { submittedAt: "asc" },
      },
    },
  });

  if (!assessmentSession) {
    redirect(buildAdminReportHrefWithPage(filters, page));
  }

  const detail = buildTeamDetail({
    code: assessmentSession.code,
    name: assessmentSession.name,
    ownerEmail: assessmentSession.ownerEmail,
    createdAt: assessmentSession.createdAt.toISOString(),
    submissions: assessmentSession.submissions.map(toSubmissionRecord),
  });

  return (
    <section className="page-container">
      <div className="team-session-banner card form-card">
        <div className="team-session-banner-copy">
          <h3>{detail.name}</h3>
          <p>
            Session code <strong>{detail.code}</strong>. Track this team&apos;s submission timeline
            and score evolution over time.
          </p>
        </div>
        <a href={buildAdminReportHrefWithPage(filters, page)} className="button ghost">
          Back to report
        </a>
      </div>

      <section className="submissions-table admin-table-section">
        <h3>Team Detail Timeline</h3>
        <p className="admin-team-meta">
          Owner {detail.ownerEmail} · Created {new Date(detail.createdAt).toLocaleDateString()} ·{" "}
          {detail.uniqueParticipants} participants · {detail.totalSubmissions} submissions
        </p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Email</th>
                <th>Score</th>
                <th>Completion</th>
                <th>Score Level</th>
                <th>Running Avg</th>
              </tr>
            </thead>
            <tbody>
              {detail.submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-empty-cell">
                    No submissions yet for this session.
                  </td>
                </tr>
              ) : (
                detail.submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="date-cell">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                    <td>{submission.email}</td>
                    <td className="score-cell">
                      {submission.totalScore}/{submission.maxScore}
                    </td>
                    <td>{submission.completion}%</td>
                    <td>
                      <span className="status-badge">{submission.scoreLevel}</span>
                    </td>
                    <td className="score-cell">{submission.runningAverageScore}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
