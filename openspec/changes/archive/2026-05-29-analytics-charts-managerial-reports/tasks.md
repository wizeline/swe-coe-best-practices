## 1. Dependencies & Types

- [x] 1.1 Install `recharts` as a runtime dependency (`npm install recharts`)
- [x] 1.2 Add `orgCategoryAverages: Record<string, number>` to `CrossTeamComparison` in `src/types/assessment.ts`
- [x] 1.3 Add `TeamDetailRecord` type extension or prop interface to carry `orgCategoryAverages` into team detail pages (if not already present)

## 2. Data Layer

- [x] 2.1 Update `buildCrossTeamComparison()` in `src/lib/admin.ts` to compute `orgCategoryAverages` by averaging `categoryAverages` across all sessions (unfiltered)
- [x] 2.2 Update `src/app/admin/page.tsx` to pass `filteredSessions` (the full filtered list, not just `paginatedSessions.items`) as a separate prop to `AdminOverview`
- [x] 2.3 Add `/api/sessions/org-averages` route handler returning `{ categoryAverages: Record<string, number> }` for use by the client-side dashboard

## 3. Chart Component Layer

- [x] 3.1 Create `src/components/charts/` directory and `index.ts` barrel export
- [x] 3.2 Create `src/components/charts/ScoreLevelDistribution.tsx` — bar or donut chart showing team count per score level; accepts `sessions: Array<{ scoreLevel: string }>` prop
- [x] 3.3 Create `src/components/charts/PillarAveragesChart.tsx` — horizontal bar chart of org pillar averages; accepts `pillars: Array<{ id: string; label: string; average: number }>` prop
- [x] 3.4 Create `src/components/charts/TeamRankingChart.tsx` — horizontal bar chart ranking teams by avg score colored by level; accepts `teams: Array<{ name: string; averageTotalScore: number; scoreLevel: string }>` prop
- [x] 3.5 Create `src/components/charts/PillarRadarChart.tsx` — radar comparing team vs org per pillar; accepts `pillars: Array<{ id: string; label: string; teamAvg: number; orgAvg: number }>` prop
- [x] 3.6 Add empty-state handling to each chart component (render placeholder text when data array is empty)
- [x] 3.7 Define `SCORE_LEVEL_COLORS` constant (shared across chart components) mapping Foundational/Disciplined/Optimized/Strategic to consistent hex colors

## 4. Admin Overview Integration

- [x] 4.1 Update `AdminOverview` props interface to accept `filteredSessions: SessionComparisonRecord[]` and `orgCategoryAverages: Record<string, number>`
- [x] 4.2 Add a charts section above the filters/table in `AdminOverview.tsx` rendering `ScoreLevelDistribution`, `PillarAveragesChart`, and `TeamRankingChart` — always visible
- [x] 4.3 Derive chart data props from `filteredSessions` inside `AdminOverview` (compute pillar averages from `filteredSessions[].categoryAverages`, count by score level, build team ranking array)

## 5. Team Detail Integration

- [x] 5.1 Update `src/app/admin/team/[code]/page.tsx` to pass `orgCategoryAverages` (from `comparison.orgCategoryAverages`) down to the team detail view component
- [x] 5.2 Render `PillarRadarChart` on the team detail page using team `categoryAverages` vs `orgCategoryAverages`
- [x] 5.3 Update `DashboardView.tsx` to fetch org averages from `/api/sessions/org-averages` on load (alongside existing data fetches)
- [x] 5.4 Render `PillarRadarChart` in `DashboardView.tsx` only when `canShowTeamView` is true (session owner), using team `categoryAverages` vs fetched org averages

## 6. Tests & Validation

- [x] 6.1 Add unit tests for `buildCrossTeamComparison()` covering `orgCategoryAverages` computation (empty sessions, single session, multiple sessions with different pillars)
- [x] 6.2 Add unit tests for `/api/sessions/org-averages` route handler (or the pure helper it calls)
- [x] 6.3 Add unit tests for each chart component verifying: renders with valid data, renders empty state with empty array, `ScoreLevelDistribution` groups levels correctly
- [x] 6.4 Run `npm run lint && npm test && npm run build` — all three must pass

## 7. Documentation

- [x] 7.1 Update `TECHNICAL.md` to document the new chart component layer, `orgCategoryAverages` field, and `/api/sessions/org-averages` endpoint
- [x] 7.2 Update `PRODUCT.md` to describe the new admin analytics charts and team-vs-org radar features
