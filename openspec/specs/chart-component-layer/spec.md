## Purpose
Define chart component architecture constraints for reusable, side-effect-free visualization components.

## Requirements

### Requirement: Chart components accept pure data props
Each chart component in `src/components/charts/` SHALL accept only plain data props (no API calls, no Prisma imports, no browser storage access).

#### Scenario: Chart renders with data
- **WHEN** a chart component receives valid data props
- **THEN** it renders the chart without performing any side effects or network calls

#### Scenario: Chart renders empty state
- **WHEN** a chart component receives an empty data array
- **THEN** it renders a meaningful empty state (text or placeholder) rather than a broken chart

### Requirement: Chart components use project design tokens
Chart components SHALL use CSS variables from `globals.css` for colors where applicable, and a consistent score-level color map for level-specific coloring.

#### Scenario: Score level colors are consistent
- **WHEN** a score level (Foundational / Disciplined / Optimized / Strategic) is represented in any chart
- **THEN** it uses the same color across all chart components

### Requirement: Chart layer is extensible for future capabilities
The `src/components/charts/index.ts` barrel export SHALL expose all chart components so future additions (heatmap, trend lines) follow the same pattern without modifying existing chart files.

#### Scenario: New chart added without modifying existing charts
- **WHEN** a new chart component is added to `src/components/charts/`
- **THEN** it can be exported from `index.ts` and consumed independently
