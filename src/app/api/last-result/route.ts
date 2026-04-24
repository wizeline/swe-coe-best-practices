import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentResult, LastResultRecord } from "@/types/assessment";

async function getSessionEmail(): Promise<string | null> {
  const session = await auth();
  return session?.user?.email?.toLowerCase().trim() ?? null;
}

export async function GET() {
  const email = await getSessionEmail();

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await prisma.lastResult.findUnique({ where: { email } });

  if (!record) {
    return NextResponse.json({ data: null });
  }

  const data: LastResultRecord = {
    email: record.email,
    result: record.result as unknown as AssessmentResult,
    savedAt: record.savedAt.toISOString(),
  };

  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    result?: AssessmentResult;
  };

  if (!email || !body.result) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.lastResult.upsert({
    where: { email },
    update: {
      result: body.result as unknown as Prisma.JsonObject,
    },
    create: {
      email,
      result: body.result as unknown as Prisma.JsonObject,
    },
  });

  return NextResponse.json({ ok: true });
}
