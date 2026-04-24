import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AnswerMap } from "@/types/assessment";

async function getSessionEmail(): Promise<string | null> {
  const session = await auth();
  return session?.user?.email?.toLowerCase().trim() ?? null;
}

export async function GET() {
  const email = await getSessionEmail();

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const draft = await prisma.draft.findUnique({ where: { email } });
  return NextResponse.json({ answers: (draft?.answers as AnswerMap | null) ?? null });
}

export async function PUT(request: Request) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    answers?: AnswerMap;
  };

  if (!email || !body.answers) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const sanitizedAnswers = Object.fromEntries(
    Object.entries(body.answers).filter(([, value]) => value !== undefined),
  );

  await prisma.draft.upsert({
    where: { email },
    update: { answers: sanitizedAnswers },
    create: {
      email,
      answers: sanitizedAnswers,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const email = await getSessionEmail();

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.draft.deleteMany({
    where: { email },
  });

  return NextResponse.json({ ok: true });
}
