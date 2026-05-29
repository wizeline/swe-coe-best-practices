## Purpose
Define radar-chart comparison requirements between team-level and organization-level pillar performance.

## Requirements

### Requirement: Team vs org radar chart on admin team detail
The `/admin/team/[code]` page SHALL display a radar chart comparing the team's per-pillar averages against the org-wide all-time average per pillar.

#### Scenario: Two series displayed
- **WHEN** an admin views a team detail page
- **THEN** the radar shows two overlapping series: one for the team's averages and one for the org baseline

#### Scenario: Org baseline is all-time
- **WHEN** the radar renders
- **THEN** the org baseline reflects all sessions (not filtered by date) so the comparison is stable

#### Scenario: Pillars labeled by title
- **WHEN** the radar renders
- **THEN** each axis is labeled with the pillar's human-readable title

### Requirement: Team vs org radar chart on team-owner dashboard
The `/dashboard?session=<code>` page (team-owner view) SHALL display the same radar chart comparing the team's per-pillar averages against the org baseline.

#### Scenario: Radar visible to session owner only
- **WHEN** a user views the dashboard in team-owner mode (owns the selected session)
- **THEN** the radar chart is visible

#### Scenario: Radar hidden for non-owners
- **WHEN** a user views the dashboard as a session participant (not the owner)
- **THEN** the radar chart is not displayed
