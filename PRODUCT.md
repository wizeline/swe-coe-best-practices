# Product Reference - SWE Best Practices Pulse

Product definition and scoring model for the assessment experience.

> For the complete framework reference (pillars, questions, rubrics, recommendations, and the Engineering Excellence Cycle) in a stakeholder-readable format, see [FRAMEWORK.md](FRAMEWORK.md).

## Product Overview

Internal tool for self-assessing engineering practices across five pillars at a personal level. Developers score 16 of their own habits on a 1-4 scale and receive a score level, weighted pillar scores, and prioritized recommendations.

## What It Measures

Five pillars, each with 2-3 questions scored 1 (Foundational) to 4 (Strategic):

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

## Routes

| Route       | Purpose                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| /           | Redirects based on auth state                                                 |
| /login      | Google sign-in page                                                           |
| /assessment | Individual or team-session voting form (auth required)                        |
| /dashboard  | Personal results plus owned and joined team session views (auth required)     |
| /playbook   | Markdown-backed engineering playbook organized by pillar (auth required)      |
| /admin      | Admin-only cross-team comparison plus database activity stats (auth required) |

Team session reports include one prioritized action item per pillar, selected based on the team's average results and relevance to their current score level. The action item shown is the next achievable improvement goal.
Users who participate in a team session can reopen that session from the dashboard and see their own latest submission plus their personal action items, while the aggregated team report remains owner-only.
Dashboard score cards now show current level, next target level, and points remaining to reach it (individual and team views).
Category/pillar breakdown rows show score as `current / 4.0` and the gap to optimal to make distance-to-target explicit.
Dashboard session cards show each session's creation date, and the create-session field guides naming with the `Team - Quarter` pattern.
Draft answers are stored locally in the browser (localStorage) until the assessment is submitted.
The admin page shows database-level counts for assessments, sessions, saved results, unique participants, and session owners.
It also compares team sessions side by side using average score, score level, participation, completion, and per-pillar averages.
Admins can filter and sort reports by session creation dates, paginate large cross-team reports, then open a dedicated team detail view with a back-to-report action to inspect submission history and running score evolution over time.
The playbook is maintained in `content/playbook.md` and rendered into pillar sections so content can evolve without UI changes. Each pillar can include practice cards with `Do this`, `Why this works`, and `How to` guidance. AI is referenced within `How to` steps as a practical accelerator alongside the core technique.

## Repository Analysis (Alternative Assessment Method)

In addition to the manual questionnaire, engineers can use an automated repository analysis prompt to score their projects. This method analyzes observable signals from a repository: commit history, CI/CD configuration, test coverage, documentation, and code organization, to determine a score.

### How It Works

1. **Get the prompt**: The analysis prompt is located in `prompts/repo-analysis.md` and is also available from a collapsible copyable section in `/assessment`
2. **Run the prompt**: Copy the prompt and paste it into your AI assistant (ChatGPT, Claude, etc.)
3. **Provide repository context**: Share your repository's:
   - Directory structure (output of `ls -la` and `tree -L 2`)
   - Recent commits (output of `git log --oneline -50`)
   - CI/CD configuration (`.github/workflows/*.yml`, `.gitlab-ci.yml`, etc.)
   - Test framework and coverage info
   - README and architecture documentation
   - Package/dependency files
4. **Get analysis**: The AI will analyze the signals and return:
   - A minimal JSON block for dashboard submission
   - A separate private recommendations section for the user
     The private recommendations are not meant to be stored in the product.

   The submission JSON contains:
   - Individual question scores (1-4 per question)
   - Pillar scores
   - Raw score (0-48)
   - Score level (Foundational/Disciplined/Optimized/Strategic)

5. **Submit to dashboard**: Go to `/assessment` → "Repository Analysis" section → paste only the JSON content → submit
6. **Track progress**: Results appear on your dashboard alongside questionnaire submissions

Route failures while submitting or loading assessment data are surfaced with toast notifications so users receive immediate feedback without losing form context.

### Advantages

- **No manual effort**: Analysis happens automatically based on repository signals
- **Language-agnostic**: Works with repositories in any programming language
- **Objective**: Scores reflect actual practices, not self-reported perceptions
- **Repeatable**: Run quarterly to measure improvement over time
- **Actionable**: Recommendations are specific to your repository's score level

### Scoring Basis

The prompt analyzes:

- **Commit message quality and frequency** (Ideation & Requirements)
- **Code review discipline and automation** (Code & Delivery)
- **Test coverage and CI/CD reliability** (Testing & Quality)
- **README, architecture docs, and onboarding materials** (Documentation & Knowledge)
- **Monitoring, incident response processes** (Operations & Process)

Results are stored identically to questionnaire submissions, so you can compare both methods and track progress over time.

## Future Proposals

- Session invite by email: let owners invite specific users to a session instead of sharing a public link.
- Historical trend charts: plot a team's average score over time when a session is run repeatedly.
