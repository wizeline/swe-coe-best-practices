## Why

The admin dashboard currently presents cross-team data only as a sortable table, requiring managers to mentally aggregate patterns. Visual charts will make score distribution, pillar weaknesses, and team comparisons immediately actionable for engineering leaders who need to allocate coaching and identify org-wide trends.

## What Changes

- Install Recharts as the charting library (tree-shakeable, React-native, SVG-based for print compatibility).
- Add three always-visible charts to `/admin` above the existing table, scoped to the active date filter:
  - **Score Level Distribution**: count of teams per level (Foundational / Disciplined / Optimized / Strategic).
  - **Org Pillar Averages**: horizontal bar showing average score per pillar across all filtered sessions.
  - **Team Ranking**: horizontal bar ranking all filtered teams by average total score, colored by score level.
- Add an `orgCategoryAverages` field to `CrossTeamComparison` (computed from the full unfiltered session set to serve as a stable baseline).
- Pass `filteredSessions` (the full filtered list, not just the paginated slice) to `AdminOverview` so charts show complete data.
- Add a **Pillar Radar (Team vs Org)** chart to both `/admin/team/[code]` and `/dashboard?session=...` (team-owner view), comparing the team's per-pillar averages against the org baseline.
- Introduce a dedicated `src/components/charts/` layer with pure, prop-driven components — no API calls inside charts.

## Capabilities

### New Capabilities

- `admin-analytics-charts`: Charts displayed on `/admin` for org-wide score distribution, pillar averages, and team ranking — scoped to the active date filter.
- `team-vs-org-radar`: Radar chart comparing a team's per-pillar averages against the org baseline, shown on `/admin/team/[code]` and the team-owner dashboard.
- `chart-component-layer`: Isolated, reusable Recharts-based components under `src/components/charts/` with pure data props, designed to support future additions (per-question heatmap, ML data export).

### Modified Capabilities

<!-- No existing spec-level requirements are changing. -->

## Impact

- **New dependency**: `recharts` (runtime).
- **`src/types/assessment.ts`**: `CrossTeamComparison` gains `orgCategoryAverages: Record<string, number>`.
- **`src/lib/admin.ts`**: `buildCrossTeamComparison()` computes `orgCategoryAverages` from all sessions.
- **`src/app/admin/page.tsx`**: Passes `filteredSessions` (full filtered list) alongside paginated items to `AdminOverview`.
- **`src/components/assessment/AdminOverview.tsx`**: Renders chart section above the table; receives `filteredSessions` prop.
- **`src/app/admin/team/[code]/page.tsx`**: Passes team `categoryAverages` + `orgCategoryAverages` to team detail view.
- **`src/components/assessment/DashboardView.tsx`**: Passes org baseline to radar when in team-owner view.
- **New**: `src/components/charts/` — four chart components + barrel export.
