## Why

The deployment infrastructure is no longer available, but the assessment tool still has value as a self-service resource for engineering teams and as a mentoring aid for leaders. Converting to a static site removes all infrastructure costs while preserving the core self-assessment experience.

## What Changes

- **BREAKING**: Remove authentication (Google OAuth, NextAuth, middleware). The tool becomes publicly accessible.
- **BREAKING**: Remove all server-side persistence (Prisma, SQLite/Postgres, API route handlers). Results are ephemeral and local to the browser session.
- **BREAKING**: Remove team session management (create/join sessions, team stats, org averages). Assessment is individual only.
- Remove the admin panel (`/admin`).
- Remove the login page (`/login`).
- Simplify `DashboardView` to show individual results read from `localStorage`.
- Simplify `AssessmentForm` submit: calculate locally, write to `localStorage`, navigate to `/dashboard`.
- Preserve the `RepositoryAnalysisSubmission` component (copy prompt + parse JSON + show local results) without the API submission step.
- Configure Next.js for static export (`output: 'export'`, `basePath: '/wz-int-swe-best-practices'`, `images.unoptimized: true`).
- Add a GitHub Actions workflow to build and deploy to GitHub Pages on push to `main`.
- Tag the current commit as `v1-with-backend` before beginning removal work.

## Capabilities

### New Capabilities

- `static-assessment`: Individual self-assessment flow without authentication or server persistence. Answers are auto-saved to `localStorage`; results are calculated client-side and stored in `localStorage` for the dashboard to read.
- `github-pages-deploy`: Automated build and deploy pipeline via GitHub Actions targeting `https://wizeline.github.io/wz-int-swe-best-practices`.

### Modified Capabilities

<!-- No existing spec-level requirements are changing. The removed server-backed capabilities (sessions, admin analytics, org radar) have no delta specs because their requirements are being dropped, not changed. -->

## Impact

- **Removed files**: `src/auth.ts`, `src/middleware.ts`, `src/app/api/` (all route handlers), `src/app/login/`, `src/app/admin/`, `src/lib/prisma.ts`, `src/lib/storage.ts`, `src/lib/admin.ts`, `src/lib/teamStats.ts`, `src/lib/sessionDisplay.ts`, `prisma/`
- **Simplified components**: `DashboardView.tsx` (remove `SessionHub`, `TeamView`, all API-loading logic), `AssessmentForm.tsx` (replace `addSubmission()` call with `localStorage` write), `AssessmentPage` and `DashboardPage` server components (remove `auth()` calls, convert to client-compatible pages)
- **Preserved as-is**: `src/lib/scoring.ts`, `src/lib/draftStorage.ts`, `src/data/assessmentTemplate.ts`, `src/components/charts/`, `AssessmentReview.tsx`, `ErrorToast.tsx`, `content/playbook.md`
- **New files**: `.github/workflows/deploy.yml`, `.nojekyll`
- **Dependencies removed**: `next-auth`, `@prisma/client`, `prisma` (dev)
- **`next.config.ts`**: gains `output`, `basePath`, `images.unoptimized`
