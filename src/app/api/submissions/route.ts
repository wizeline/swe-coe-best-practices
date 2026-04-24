import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AnswerMap, AssessmentResult, SubmissionRecord } from "@/types/assessment";

function toSubmissionRecord(data: {
  id: string;
  email: string;
  answers: Prisma.JsonValue;
  result: Prisma.JsonValue;
  submittedAt: Date;
}): SubmissionRecord {
  return {
    id: data.id,
    email: data.email,
    answers: data.answers as unknown as AnswerMap,
    result: data.result as unknown as AssessmentResult,
    submittedAt: data.submittedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const latestOnly = searchParams.get("latest") === "true";

  if (latestOnly) {
    const latest = await prisma.submission.findFirst({
      where: { email },
      orderBy: { submittedAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json(null);
    }

    return NextResponse.json(toSubmissionRecord(latest));
  }

  const submissions = await prisma.submission.findMany({
    where: { email },
    orderBy: { submittedAt: "asc" },
  });

  return NextResponse.json(submissions.map(toSubmissionRecord));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    answers?: AnswerMap;
    result?: AssessmentResult;
  };

  if (!email || !body.answers || !body.result) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const created = await prisma.submission.create({
    data: {
      email,
      answers: body.answers as unknown as Prisma.InputJsonValue,
      result: body.result as unknown as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json(toSubmissionRecord(created), { status: 201 });
}
