-- Track explicit membership for users who participate in team sessions

CREATE TABLE IF NOT EXISTS "SessionParticipant" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSubmittedAt" TIMESTAMP(3),
  CONSTRAINT "SessionParticipant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SessionParticipant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AssessmentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "SessionParticipant_sessionId_email_key" ON "SessionParticipant"("sessionId", "email");
CREATE INDEX IF NOT EXISTS "SessionParticipant_email_joinedAt_idx" ON "SessionParticipant"("email", "joinedAt");
CREATE INDEX IF NOT EXISTS "SessionParticipant_sessionId_lastSubmittedAt_idx" ON "SessionParticipant"("sessionId", "lastSubmittedAt");

INSERT INTO "SessionParticipant" ("id", "sessionId", "email", "joinedAt", "lastSubmittedAt")
SELECT
  md5("sessionId" || ':' || lower("email"))::text,
  "sessionId",
  lower("email"),
  MIN("submittedAt") AS "joinedAt",
  MAX("submittedAt") AS "lastSubmittedAt"
FROM "Submission"
WHERE "sessionId" IS NOT NULL
GROUP BY "sessionId", lower("email")
ON CONFLICT ("sessionId", "email") DO UPDATE SET
  "lastSubmittedAt" = GREATEST(
    COALESCE("SessionParticipant"."lastSubmittedAt", EXCLUDED."lastSubmittedAt"),
    EXCLUDED."lastSubmittedAt"
  );