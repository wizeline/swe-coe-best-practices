## Context

The app is a Next.js 16 (App Router) tool with Google OAuth, Prisma + Postgres persistence, team session management, and an admin panel. The deployment budget has been cut, so the goal is to strip all server-side concerns and ship as a static site on GitHub Pages. The core value — the self-assessment questionnaire, scoring logic, and recommendations — survives intact. Team and admin features are dropped entirely.

Current entry points that require a server:
- `src/auth.ts` / `src/middleware.ts` — NextAuth + JWT
- `src/app/api/` — route handlers for submissions, sessions, auth
- `src/app/admin/`, `src/app/login/` — server-rendered pages with `auth()` guards
- `src/lib/prisma.ts`, `src/lib/storage.ts` — DB access and API wrappers

## Goals / Non-Goals

**Goals:**
- Static export buildable with `next build` (`output: 'export'`)
- Deploy automatically to `https://wizeline.github.io/wz-int-swe-best-practices` on push to `main`
- Preserve individual assessment flow: form → local scoring → dashboard with results + read-only review
- Preserve draft autosave (already uses `localStorage`)
- Preserve the playbook page (static markdown)
- Preserve `RepositoryAnalysisSubmission` for mentoring use (copy prompt + local result display)
- Tag `v1-with-backend` before any removal to keep server version accessible in git history

**Non-Goals:**
- Multi-user or real-time collaboration
- Persistent results across devices or browsers
- Any form of authentication
- Admin analytics or cross-team reporting
- Migrating existing submission data

## Decisions

### D1: Result hand-off between `/assessment` and `/dashboard` via `localStorage`

**Decision:** After `calculateAssessment()`, write `{ result, answers, submittedAt }` to `localStorage` under a fixed key (`assessment-result`). The dashboard page reads from that key on mount.

**Alternatives considered:**
- URL query params (base64-encoded result): shareable, but Next.js static export + `basePath` makes deep-link hydration fragile and URLs become unwieldy (~2KB encoded).
- Keep result in React state and use `router.push` with state: not supported in Next.js App Router.
- Single-page no-routing app: would require significant restructuring; current two-page model maps cleanly to `localStorage` hand-off.

**Rationale:** `localStorage` is already used for draft autosave (`draftStorage.ts`). Extending that pattern is consistent and requires no new infrastructure. Results persist across browser reloads, which is a useful side effect for mentoring (leader can share their screen after completing).

### D2: Delete removed code, preserve via git tag rather than keeping dead code in-tree

**Decision:** Delete `src/auth.ts`, `src/middleware.ts`, `src/app/api/`, `src/app/login/`, `src/app/admin/`, `src/lib/prisma.ts`, `src/lib/storage.ts`, `src/lib/admin.ts`, `src/lib/teamStats.ts`, `src/lib/sessionDisplay.ts`, and `prisma/`. Tag `v1-with-backend` before starting.

**Alternatives considered:**
- Keep server code in a `/server` subdirectory: `output: 'export'` causes `next build` to fail if any API routes or server components using `auth()` exist anywhere in the project tree. Co-existence is not possible.
- Feature-flag dead code: adds complexity with no benefit; the code can never run in a static build.

**Rationale:** A clean tree prevents confusion and build failures. Git history is the correct archival mechanism.

### D3: Simplify `DashboardView` rather than replace it

**Decision:** Strip `DashboardView.tsx` of `SessionHub`, `TeamView`, all API-loading `useEffect` logic, and the `userEmail` prop. Keep only `ScoreCard` and the `AssessmentReview` entry point, reading the result from `localStorage`.

**Rationale:** The existing `ScoreCard` and `AssessmentReview` sub-components are already decoupled from the API layer and require no changes. Rewriting the whole component would risk regressions in the parts that work.

### D4: Convert server page components to client-compatible or pure static pages

**Decision:**
- `app/page.tsx`: redirect to `/assessment` unconditionally (no `auth()` needed).
- `app/assessment/page.tsx`: remove `auth()` and `readFile` for prompt; pass `promptContent` from a static import or direct file read replaced with a client-side fetch of the static file.
- `app/dashboard/page.tsx`: remove `auth()`, pass no `userEmail` (dashboard reads from `localStorage`).
- `app/playbook/page.tsx`: remove `auth()`, keep `loadPlaybookContent()` (reads from `content/playbook.md` via `fs` — this is fine in a server component during build time with `output: 'export'`).

### D5: GitHub Actions deploy workflow

**Decision:** Use the official `actions/upload-pages-artifact` + `actions/deploy-pages` actions on push to `main`. Build step runs `npm ci && npm run build`. The `out/` directory is uploaded as the Pages artifact. A `.nojekyll` file is added to `out/` to prevent GitHub Pages from ignoring the `_next/` assets folder.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Results lost if user clears browser storage | Acceptable trade-off for zero-infra; document in README |
| `output: 'export'` fails if any route uses dynamic server features post-cleanup | Run `npm run build` as part of every task to catch regressions early |
| `basePath` breaks internal `<img src>` or hardcoded paths | Audit for hardcoded paths; use `next/image` or relative paths |
| `app/assessment/page.tsx` uses `readFile` (Node.js fs) for prompt content | Replace with a static import or move prompt file to `public/` and fetch client-side |

## Migration Plan

1. `git tag v1-with-backend && git push origin v1-with-backend`
2. Configure `next.config.ts` (`output: 'export'`, `basePath`, `images.unoptimized`)
3. Remove server-only files (auth, middleware, api routes, prisma, admin, login)
4. Update page components (remove `auth()`, adapt data loading)
5. Simplify `AssessmentForm` submit (localStorage write instead of `addSubmission`)
6. Simplify `DashboardView` (localStorage read, remove team/session features)
7. Update `DashboardPage` and `AssessmentPage` props accordingly
8. Add `.nojekyll` to `public/` (Next.js copies `public/` contents to `out/`)
9. Add `.github/workflows/deploy.yml`
10. Run `npm run lint && npm test && npm run build` — fix any failures
11. Push to `main`, verify GitHub Pages deployment

**Rollback:** The `v1-with-backend` tag preserves the full server version. A new deployment of the server version requires restoring environment variables and a Postgres instance.

## Open Questions

- None. All decisions have been made during the explore session.
