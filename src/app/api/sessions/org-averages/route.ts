import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildOrgCategoryAverages } from "@/lib/admin";
import { getScoreLevel } from "@/lib/scoring";
import { prisma } from "@/lib/prisma";
import { AnswerMap, AssessmentResult, SubmissionRecord } from "@/types/assessment";

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
  const categoryScores = parsedResult.categories?.map((category) => category.score);
  const scoreLevel = getScoreLevel(totalScore, maxScore, categoryScores);

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

export async function GET() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.assessmentSession.findMany({
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
          answers: true,
          result: true,
          submittedAt: true,
        },
        orderBy: { submittedAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categoryAverages = buildOrgCategoryAverages(
    sessions.map((assessmentSession) => ({
      id: assessmentSession.id,
      code: assessmentSession.code,
      name: assessmentSession.name,
      ownerEmail: assessmentSession.ownerEmail,
      createdAt: assessmentSession.createdAt.toISOString(),
      submissions: assessmentSession.submissions.map(toSubmissionRecord),
    }))
  );

  return NextResponse.json({ categoryAverages });
}