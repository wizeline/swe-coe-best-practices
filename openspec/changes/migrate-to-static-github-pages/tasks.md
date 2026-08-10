## 1. Preserve backend version

- [x] 1.1 Create git tag `v1-with-backend` at current HEAD and push it to origin

## 2. Configure static export

- [x] 2.1 Add `output: 'export'`, `basePath: '/wz-int-swe-best-practices'`, and `images: { unoptimized: true }` to `next.config.ts`
- [x] 2.2 Add a `.nojekyll` file to `public/` so GitHub Pages serves `_next/` assets

## 3. Remove server-only code

- [x] 3.1 Delete `src/auth.ts` and `src/middleware.ts`
- [x] 3.2 Delete `src/app/api/` directory (all route handlers)
- [x] 3.3 Delete `src/app/login/` directory
- [x] 3.4 Delete `src/app/admin/` directory
- [x] 3.5 Delete `src/lib/prisma.ts`, `src/lib/storage.ts`, `src/lib/admin.ts`, `src/lib/teamStats.ts`, `src/lib/sessionDisplay.ts`
- [x] 3.6 Delete `prisma/` directory
- [x] 3.7 Remove `next-auth`, `@prisma/client`, and `prisma` from `package.json` and run `npm install`

## 4. Update page components

- [x] 4.1 Rewrite `src/app/page.tsx` to redirect unconditionally to `/assessment` (remove `auth()`)
- [x] 4.2 Rewrite `src/app/assessment/page.tsx` to remove `auth()`, `readFile`, and `userEmail`; move `promptContent` loading to a static import or `public/` fetch
- [x] 4.3 Rewrite `src/app/dashboard/page.tsx` to remove `auth()` and `userEmail` prop
- [x] 4.4 Rewrite `src/app/playbook/page.tsx` to remove `auth()` (keep `loadPlaybookContent()` — safe for static build-time)

## 5. Implement localStorage result hand-off

- [x] 5.1 Add `saveResult` and `loadResult` helpers to `src/lib/draftStorage.ts` (key: `assessment-result`, value: `{ result, answers, submittedAt }`)
- [x] 5.2 Update `AssessmentForm.tsx` `handleSubmit`: replace `addSubmission()` call with `saveResult()` then navigate to `/dashboard`
- [x] 5.3 Remove `userEmail` and `initialSessionCode` props from `AssessmentForm` (no longer needed)

## 6. Simplify DashboardView

- [x] 6.1 Remove all API-loading logic from `DashboardView.tsx` (`useEffect` that calls `loadUserSessions`, `getLatestSubmissionByEmail`, `loadTeamSubmissions`, etc.)
- [x] 6.2 Remove `SessionHub`, `TeamView`, session management state, and all related handlers from `DashboardView.tsx`
- [x] 6.3 Add `loadResult()` call on mount; display `ScoreCard` and `AssessmentReview` when result exists, or an empty state with a link to `/assessment` when it does not
- [x] 6.4 Remove `userEmail` and `initialSessionCode` props from `DashboardView`

## 7. Fix RepositoryAnalysisSubmission

- [x] 7.1 Remove the `handleSubmit` API call (`submitRepositoryAnalysis`) from `RepositoryAnalysisSubmission.tsx`; display parsed result locally in the component instead of navigating to `/dashboard`

## 8. Validation

- [x] 8.1 Run `npm run lint` and fix all errors
- [x] 8.2 Run `npm test` and fix any broken tests (update or delete tests for removed modules)
- [ ] 8.3 Run `npm run build` and confirm the `out/` directory is generated without errors

## 9. GitHub Actions deploy workflow

- [x] 9.1 Create `.github/workflows/deploy.yml` with a workflow that runs on push to `main`, executes `npm ci && npm run build`, and deploys `out/` to GitHub Pages using `actions/upload-pages-artifact` and `actions/deploy-pages`

## 10. Documentation

- [x] 10.1 Update `README.md` to reflect the static-only deployment: remove backend setup instructions, add GitHub Pages URL, note that results are browser-local
- [x] 10.2 Update `TECHNICAL.md` to document the removed server-side layers and the new `localStorage` result hand-off pattern
