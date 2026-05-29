## ADDED Requirements

### Requirement: Score level distribution chart
The admin page SHALL display a chart showing the count of filtered teams at each score level (Foundational, Disciplined, Optimized, Strategic), always visible above the cross-team table.

#### Scenario: Chart reflects active date filter
- **WHEN** an admin applies a date filter on `/admin`
- **THEN** the score level distribution chart updates to count only teams within the filtered date range

#### Scenario: Empty state
- **WHEN** no sessions match the active filter
- **THEN** the chart section renders an empty state message instead of an empty chart

---

### Requirement: Org pillar averages chart
The admin page SHALL display a horizontal bar chart showing the average score per pillar across all filtered sessions.

#### Scenario: Pillar averages use filtered sessions
- **WHEN** an admin views `/admin` with a date filter applied
- **THEN** the pillar averages chart reflects only the filtered sessions, not all-time data

#### Scenario: Pillars labeled by title
- **WHEN** the chart renders
- **THEN** each bar is labeled with the pillar's human-readable title (not its ID)

---

### Requirement: Team ranking chart
The admin page SHALL display a horizontal bar chart ranking all filtered teams by their average total score, with bars colored by score level.

#### Scenario: Teams sorted by score descending
- **WHEN** the ranking chart renders
- **THEN** teams are ordered from highest to lowest average total score

#### Scenario: Score level color coding
- **WHEN** a team bar is rendered
- **THEN** its color corresponds to the team's score level using a consistent palette

#### Scenario: Team name as label
- **WHEN** the ranking chart renders
- **THEN** each bar is labeled with the session name, not the session code
