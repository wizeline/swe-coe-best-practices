## Context

The app has rich per-pillar aggregation already computed in `buildTeamStats()` and `buildCrossTeamComparison()`. The admin page passes only a paginated slice (10 items) to `AdminOverview`, so charts seeing the full filtered dataset requires a small prop addition. No new API endpoints are needed — all chart data flows from existing server-side queries already in `src/app/admin/page.tsx`.

The project has no existing charting library. It uses plain CSS with CSS variables (`--brand-primary`, etc.) and no component libraries.

## Goals / Non-Goals

**Goals:**
- Three org-level charts on `/admin` (distribution, pillar averages, team ranking), always visible, scoped to the active date filter.
- One team-vs-org radar on `/admin/team/[code]` and `/dashboard?session=...` (team-owner view).
- A chart component layer (`src/components/charts/`) with pure props, isolated from API/Prisma concerns — designed to grow (heatmap, export).
- Use CSS variables for chart colors so the design system stays consistent.

**Non-Goals:**
- Per-question heatmap (future Level 1 growth — architecture supports it, not implementing now).
- ML data export endpoint (future Level 2).
- Animated transitions or interactive drill-downs beyond basic Recharts tooltips.
- PDF/print-specific layout (SVG output from Recharts is print-compatible by default).
- Historical trend charts (no timestamp aggregation query added now).

## Decisions

### D1: Recharts over Chart.js, Nivo, Victory, ECharts

**Decision:** Use Recharts.

**Rationale:** Most React-native of the options (composable JSX, not canvas imperative config). Tree-shakeable — we only import `BarChart`, `RadarChart`, `PieChart`, etc. SVG output works for print. Strong React 19 compatibility. Active maintenance. Smaller than ECharts (~100KB vs ~750KB).

**Alternatives considered:**
- Chart.js + react-chartjs-2: Canvas-based, less React-idiomatic, harder to style with CSS variables.
- Nivo: Beautiful but SSR-tricky with Next.js App Router; larger bundle.
- ECharts: Most powerful but heaviest; overkill for this use case.

---

### D2: `filteredSessions` passed separately from paginated slice

**Decision:** `AdminPage` passes both `paginatedSessions.items` (for the table) and `filteredSessions` (for the charts) to `AdminOverview`.

**Rationale:** Charts must show the full filtered dataset, not just page 1. The filtered list is already computed in the server component — no extra DB query needed.

**Alternative considered:** Compute org-level aggregations on the server and pass only pre-aggregated numbers. This would reduce prop size but would require touching more files and duplicating aggregation logic.

---

### D3: `orgCategoryAverages` computed from full (unfiltered) session set

**Decision:** `orgCategoryAverages` in `CrossTeamComparison` is computed from **all** sessions regardless of date filter, serving as a stable org baseline.

**Rationale:** The team-vs-org radar on team detail pages (and the team-owner dashboard) needs a stable baseline that doesn't shift based on which admin filter is currently active. A manager drilling into `/admin/team/[code]` from the team table always sees the team compared to the true org average.

**Alternative considered:** Use `filteredSessions` for org baseline too (filter-scoped baseline). This makes the radar less comparable across time but would be useful if the user wants to compare "team vs org in Q1." Deferred — the current approach is simpler and more useful for the stated goal.

---

### D4: Pure prop-driven chart components in `src/components/charts/`

**Decision:** All chart components accept only plain data props (no `useEffect`, no fetch, no Prisma). Data is passed from the parent page/component that already owns it.

**Rationale:** Keeps charts testable in isolation, reusable across admin and dashboard views, and swappable (e.g., replace Recharts with another library later without touching page logic). Follows the existing pattern in this codebase of separating pure UI from data fetching.

---

### D5: Chart colors via CSS variables + a score-level color map

**Decision:** Use existing CSS variables (`--brand-primary`, etc.) for chart colors where possible. Introduce a `SCORE_LEVEL_COLORS` constant for the four score levels (Foundational → Disciplined → Optimized → Strategic) using a traffic-light inspired palette consistent with the existing `score-badge` CSS classes.

**Rationale:** Keeps visual identity consistent with the rest of the app. No new CSS variables needed for basic charts.

---

### D6: Org baseline for team dashboard fetched via existing `/api/submissions` path or passed as prop

**Decision:** For `/dashboard?session=...` (team-owner view in `DashboardView.tsx`), fetch the org baseline (`orgCategoryAverages`) from the admin API is not appropriate (it's an admin endpoint). Instead, add a new `/api/sessions/org-averages` endpoint that returns pillar averages across all submissions visible to the requesting user. For the `/admin/team/[code]` page, `orgCategoryAverages` is passed directly as a server-computed prop — no extra fetch needed.

**Rationale:** `DashboardView` is a client component that fetches its own data. The admin page is a server component with direct Prisma access. Different paths for different surfaces is appropriate.

**Alternative considered:** Pass `orgCategoryAverages` as an initial prop to `DashboardView` from the server page. This would avoid the extra API endpoint but couples the dashboard server page to org-level queries it doesn't currently need.

## Risks / Trade-offs

- **Recharts + React 19 SSR**: Recharts components must be rendered client-side. All chart components will be in `"use client"` files. Since `AdminOverview` is already `"use client"`, this is a non-issue for admin. The dashboard radar also already lives in a client component. → No mitigation needed.

- **filteredSessions prop size**: Passing all filtered sessions (not just 10) to `AdminOverview` increases the serialized prop payload for pages with many sessions. For typical org sizes (< 500 sessions) this is negligible. → Monitor if performance concerns arise at scale.

- **org baseline staleness on dashboard**: The `/api/sessions/org-averages` endpoint will be called on dashboard load. If org data is large, this adds a fetch. → Cache with short TTL (`revalidate`) if needed; defer optimization.

- **orgCategoryAverages is unfiltered while admin charts are filtered**: A manager might see the team radar baseline differ from the "Org Pillar Averages" bar chart (which is filter-scoped). → Document this distinction in the UI with a tooltip or label ("vs. all-time org avg").

## Open Questions

- None blocking implementation. The D6 decision (new `/api/sessions/org-averages` endpoint) is the most uncertain — if complexity warrants, the fallback is to pass org averages as a server-side initial prop to `DashboardView`.
