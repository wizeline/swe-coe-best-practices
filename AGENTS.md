# AGENTS.md - SWE Best Practices Pulse

AI agent and coding assistant instructions for this repository.

## Project Overview

**SWE Best Practices Pulse** is a static self-diagnostic for engineering habits across five pillars. Developers score 16 practices on a 1–4 scale (16 questions × 4 levels = 0–64 raw score) and receive score levels, pillar scores, and practical recommendations with prompt guides.

- **Stack:** Next.js 16 (App Router), TypeScript 5 strict, plain CSS, no Tailwind, static export
- **State:** Browser `localStorage` only via `src/lib/draftStorage.ts`
- **Routes:** `/` → redirect, `/assessment` (form + repository prompt), `/dashboard` (local results), `/playbook` (static Markdown guidance)

## Architecture

```
src/
├── app/               # Next.js App Router pages + globals.css
├── components/
│   └── assessment/    # All UI components (client-only, "use client")
├── data/              # assessmentTemplate.ts - questions, pillars, recommendations
├── lib/               # scoring.ts (pure), draftStorage.ts, playbookContent.ts
└── types/             # assessment.ts - canonical domain types
```

**Key invariant:** `src/lib/scoring.ts` is a pure function: never import browser APIs there.  
**Key invariant:** Browser persistence lives in `src/lib/draftStorage.ts`; do not access `localStorage` directly from scoring or template modules.  
**Key invariant:** The current app has no API routes, server persistence, authentication, admin panel, or team-session workflow.

## Code Style

- TypeScript strict mode: no `any`, no `@ts-ignore`
- Client components that use state or browser APIs must include `"use client"`
- CSS is in `src/app/globals.css` using CSS variables (`--brand-primary`, `--text`, `--bg-soft`, etc.)
- No Tailwind, no CSS-in-JS, no component libraries
- Use `clamp()` for responsive sizing; breakpoints at 768px, 540px, 480px
- Fonts: `var(--font-heading)` = Space Grotesk, `var(--font-mono)` = IBM Plex Mono

## Scoring Domain

- `ScoreValue = 1 | 2 | 3 | 4`: never use raw numbers outside this union
- **Per-question:** 1 = Foundational, 2 = Disciplined, 3 = Optimized, 4 = Strategic
- **Raw score range:** dynamic (`0..questionCount * 4`)
- **Score thresholds:** computed from max score by `resolveScoreBands(maxScore)` in `src/lib/scoring.ts`
- **Score band rule:** Foundational is below 43% of max score, Disciplined is 43% to below 65%, Optimized is 65% to below 85%, and Strategic is 85% and above
- **Pillar floor rule:** `Optimized` requires every pillar average to be at least `2.5`; `Strategic` requires every pillar average to be at least `3.0`
- `calculateAssessment(model, answers)` returns an `AssessmentResult`, the single source of truth for all scores
- **Per-pillar recommendations:** Each pillar shows action items (default: 1 per pillar), the most relevant next-level recommendations based on current score. Dashboard recommendation copy should be concise and immediately actionable; keep detailed `Do / Prompt / Output / Check` guidance in the playbook or prompt files. Prompts should give role, context, rules, output format, assumptions/open questions, and human verification. Configure via `NEXT_PUBLIC_MAX_RECOMMENDATIONS` environment variable in `src/lib/config.ts`.
- **Public reference calibration:** Questions and recommendations are calibrated by selected public engineering references (DORA, SPACE, NIST SSDF, OWASP SAMM, ISO/IEC 25010, SRE). Use wording like "informed by" or "aligned with selected practices"; never claim official certification, compliance, maturity audit, or external benchmark status.

## Persistence

The current product stores data only in browser `localStorage`:

- Draft answers use the draft key managed by `src/lib/draftStorage.ts`
- Latest questionnaire results use `assessment-result`
- Repository-analysis JSON is parsed and displayed locally; it is not sent to a server

Do not add server persistence, API routes, authentication, or Confluence runtime reads unless a new change explicitly reintroduces infrastructure.

## Build & Test

```bash
npm install          # install dependencies
npm run dev          # start dev server on http://localhost:3000
npm run build        # production build (must pass before any PR)
npm run lint         # ESLint (must return 0 errors before any PR)
npm test             # run unit tests with Vitest
npm run test:watch   # Vitest in watch mode
npm run test:coverage # coverage report (HTML in coverage/)
```

**CI gates:** `lint` -> `test` -> `build` - all three must pass.

## Feature Delivery Requirements (Agents)

When a user asks to develop a new feature, agents must deliver all of the following in the same task unless explicitly told otherwise:

1. Implement the feature code using existing architecture and conventions.
2. Add or update unit tests that cover the new behavior and critical edge cases.
3. Update documentation to reflect the change (at minimum, relevant sections in `PRODUCT.md` for product changes or `TECHNICAL.md` for engineering changes; update `AGENTS.md` too if repository rules or workflows changed). If questions, scoring rubrics, or recommendations change in `src/data/assessmentTemplate.ts`, also update `FRAMEWORK.md` to keep the human-readable reference in sync.

Before finishing feature work, run validation gates:

- `npm run lint`
- `npm test`
- `npm run build`

If any required item cannot be completed (for example, missing testability in legacy code), the agent must state exactly what is missing and why.

## Testing Conventions

- Tests live in `src/lib/__tests__/` alongside the code they test
- Use Vitest globals (`describe`, `it`, `expect`, `beforeEach`) - no imports needed for them
- Mock browser storage through existing draftStorage test patterns
- Test pure logic (scoring) separately from storage side-effects
- Aim for branch coverage on all scoring thresholds and edge cases

## Adding Questions or Pillars

1. Edit `src/data/assessmentTemplate.ts`
2. Add questions with unique `id` (`p{n}-q{n}` convention)
3. Add at least one `Recommendation` per score band (`band: "foundational" | "disciplined" | "optimized"`)
4. Hints must follow the format: `"1 = foundational text · 2 = disciplined text · 3 = optimized text · 4 = strategic text"` - parsed into colored bullets by `HintToggle`
5. Keep `weight` values summing to 1.0 across all categories
6. Update `FRAMEWORK.md` to reflect the new/changed questions, rubrics, or recommendations
   - Preferred: run `npm run sync:framework` (auto-generates the framework assessment section from `src/data/assessmentTemplate.ts`)
7. Run `npm test && npm run build` to confirm nothing regressed

## Repository Analysis Prompt

The project includes an automated repository analysis prompt (`prompts/repo-analysis.md`) that allows engineers to score their repositories without manual input. The prompt analyzes observable signals (commit history, test coverage, CI/CD configuration, documentation, code organization) and generates a score.

### Maintaining the Prompt

1. **Scoring rules must stay in sync with `src/lib/scoring.ts`:**
   - Score thresholds in the prompt must match `getScoreLevel()` thresholds
   - Pillar-scoring logic must align with `calculateAssessment()` logic
   - When scoring logic changes, update the prompt immediately

2. **Pillar definitions:**
   - Prompt defines the same 5 pillars and current question set as `src/data/assessmentTemplate.ts`
   - Questions and scoring rubrics must match `src/data/assessmentTemplate.ts` intent
   - Each question has a 1–4 scale with rubrics describing each level

3. **JSON output format:**
   - Prompt generates a JSON object with `analysis`, pillar question scores, `raw_score`, and `score_level`
   - This JSON is pasted into the local repository-analysis form
   - The current static app validates and displays the score locally

4. **Frontend integration:**
   - `RepositoryAnalysisSubmission` component handles JSON input and submission
   - Validation occurs on the client
   - Results are not persisted to a backend in the current static product

## Common Gotchas

- **Don't add `"use client"` to `src/lib/*.ts`**: they're plain TypeScript modules
- **Don't add server-only dependencies or API routes** unless the task explicitly changes the static deployment model
- **Don't use `0-3` scale**: the scale is `1-4`; `ScoreValue` enforces this
- **Don't use normalized scores**: use raw totals and derive thresholds from max score
- **Score thresholds are resolved by `resolveScoreBands(maxScore)`** in `src/lib/scoring.ts` — the single source of truth.
- **`AssessmentApp.tsx` is a legacy entry point**: the active form is `AssessmentForm.tsx`
- **Confluence is not a runtime dependency**: without API credentials, link to Confluence manually from content instead of fetching it from the browser
- **Public references are calibration input, not another score**: do not add a separate industry score unless a future product change explicitly asks for it
- **`vitest.config.ts`** sets the `@` path alias to `src/` - use `@/lib/...` in imports
