# Product Reference - SWE Best Practices Pulse

Product definition and scoring model for the assessment experience.

> For the complete framework reference (pillars, questions, rubrics, recommendations, and the Engineering Excellence Cycle) in a stakeholder-readable format, see [FRAMEWORK.md](FRAMEWORK.md).

## At A Glance

Internal tool for self-assessing engineering practices across five pillars at a personal level. Developers score 16 of their own habits on a 1-4 scale and receive a score level, weighted pillar scores, and prioritized recommendations.

## Core Experience

- Personal self-assessment across 5 pillars and 16 questions
- Dynamic score bands derived from the active framework size
- Per-pillar action items based on the current score level
- Team sessions where owners can see aggregated reports
- Joined-session access where participants can reopen their own latest result and action items
- Repository analysis as an alternative input method for dashboard results

## What It Measures

Five pillars, each with 2-4 questions scored from 1 (`Foundational`) to 4 (`Strategic`):

| Pillar                         | Focus                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 1 - Ideation and Requirements  | Intent Engineering: how rigorously requirements are captured, structured, and traced                            |
| 2 - Design and Architecture    | Systematic Planning: solution design, pattern reuse, security assessment, CI/CD reliability, and data integrity |
| 3 - Development                | Implementation Hygiene: clean, traceable, well-documented code changes                                          |
| 4 - Quality Engineering        | Validation and Reliability: testing thoroughness, audit practices, regression protection                        |
| 5 - Operations and Maintenance | Observability: debuggability, handoff readiness, and operational context                                        |

## Scoring Scale

Per-question scale: 1-4 (Foundational to Strategic)  
Raw score range: dynamic (`0..questionCount * 4`)

| Band rule (by max score) | Label | Definition |
| --- | --- | --- |
| Bottom range up to Disciplined threshold | Foundational | Base adherence. Follows standard Definition of Done protocols and coding conventions. Execution is reliable but predominantly ad-hoc, with minimal structural intent modeling or automated accelerators. |
| 43% to below 65% | Disciplined | Elite manual rigor. Exceptional autonomous delivery through extreme manual discipline: consistent Spec-Driven Development, Docs-as-Code, modular architectural isolation, zero syntax or deployment oversight. |
| 65% to below 85%, with no pillar below 2.5 | Optimized | Efficiency multiplier. Successfully leverages AI, advanced scripting, and automated workflows to accelerate the Disciplined-tier habits. Operates as an "Intelligence Curator" — uses automation to offload toil while retaining full human accountability over quality, edge cases, and design parity. |
| 85% and above, with no pillar below 3.0 | Strategic | Systemic influence. Operates fully "over-the-loop," orchestrating complex cross-system architectures and agentic pipelines. Defines organization-wide engineering patterns, actively mentors peers, and manages macro-level systemic risks. |

The concrete raw cutoffs are computed at runtime from `resolveScoreBands(maxScore)` in `src/lib/scoring.ts`, so adding/removing questions automatically rescales all bands.

## Dashboard And Session Behavior

- Individual submissions show the user's own score, level, category breakdown, and action items
- Individual questionnaire submissions can also be reopened in a read-only review mode from the dashboard so users can inspect the exact answers they selected
- Team session owners can open an aggregate team view with team score, level, participant summaries, and action items
- Team session owners also see a radar chart comparing their team's pillar averages against the all-time org baseline
- Team session participants can reopen joined sessions from the dashboard, see their own latest submission in that session, and review their own answers in read-only mode
- Aggregated team data remains owner-only
- Dashboard cards show current level and next target level for both individual and team views

## Routes

| Route       | Purpose                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| /           | Redirects based on auth state                                                 |
| /login      | Google sign-in page                                                           |
| /assessment | Individual or team-session voting form (auth required)                        |
| /dashboard  | Personal results plus owned and joined team session views (auth required)     |
| /playbook   | Markdown-backed engineering playbook organized by pillar (auth required)      |
| /admin      | Admin-only cross-team comparison plus database activity stats (auth required) |

## Additional Product Notes

- Team session reports show one prioritized action item per pillar based on the team's current score level
- Category rows show score as `current / 4.0` to make progress easy to scan
- Read-only answer review is limited to questionnaire submissions that store question-level answers; repository-analysis submissions continue to show summary results only
- Session cards include creation date and encourage a `Team - Quarter` naming pattern
- Draft answers are stored locally in the browser until submission
- The admin page shows database activity totals and cross-team comparisons with pagination, filtering, and drilldown
- The admin page also renders always-visible managerial charts scoped to the active date filter: score-level distribution and org pillar averages
- Team detail drilldown under `/admin/team/[code]` adds a team-vs-org radar so managers can see where a single team diverges from the organization baseline
- The playbook is maintained in `content/playbook.md` and rendered into pillar sections so content can evolve without UI changes

## Repository Analysis (Alternative Assessment Method)

In addition to the manual questionnaire, engineers can use an automated repository analysis prompt to score their projects. This method analyzes observable signals from a repository: commit history, CI/CD configuration, test coverage, documentation, and code organization, to determine a score.

### How It Works

1. Get the prompt from `prompts/repo-analysis.md` or from the copyable section in `/assessment`
2. Run the prompt in your AI assistant of choice
3. Provide repository context:
   - directory structure
   - recent commits
   - CI/CD configuration
   - test framework and coverage info
   - README and architecture documentation
   - package and dependency files
4. Receive two outputs:
   - a minimal JSON block for dashboard submission
   - a separate private recommendations section for the user
5. Paste only the JSON into `/assessment` → `Repository Analysis`
6. Review the result on the dashboard alongside questionnaire submissions

The submission JSON contains:

- individual question scores
- pillar scores
- raw score
- score level

Route failures while submitting or loading assessment data are surfaced with toast notifications so users receive immediate feedback without losing form context.

### Advantages

- No manual effort: analysis happens automatically from repository signals
- Language-agnostic: works with repositories in any programming language
- More objective: scores reflect visible engineering evidence, not only self-reporting
- Repeatable: can be run each cycle to compare progress over time
- Actionable: recommendations stay tied to the repository's actual score level

### Scoring Basis

The prompt analyzes:

- Commit message quality and frequency
- Code review discipline and automation
- Test coverage and CI/CD reliability
- README, architecture docs, and onboarding materials
- Monitoring and incident-response processes

Results are stored identically to questionnaire submissions, so you can compare both methods and track progress over time.

## Future Proposals

- Session invite by email: let owners invite specific users to a session instead of sharing a public link.
- Historical trend charts: plot a team's average score over time when a session is run repeatedly.
