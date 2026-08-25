# Product Reference - SWE Best Practices Pulse

Product definition for the current static self-diagnostic experience.

## At A Glance

SWE Best Practices Pulse is a static self-diagnostic tool for engineers. It helps a user assess their current engineering habits across five pillars, review their answers, and get practical recommendations and optional drafting guides for improving their next task.

The product is intentionally small: no server, no login, no database, no team sessions, and no admin reporting. It is designed to work as a zero-infrastructure GitHub Pages site.

The single score is informed by selected public engineering practices such as DORA, SPACE, NIST SSDF, OWASP SAMM, ISO/IEC 25010, and SRE. It is not an official benchmark, certification, compliance score, or maturity audit.

## Core Experience

- Complete a personal 16-question self-diagnostic
- Receive a score level, pillar breakdown, and prioritized recommendations
- Review the exact answers selected in the latest questionnaire submission
- Open the playbook for deeper guidance, artifacts, checklists, and optional prompt patterns
- Run an optional repository-analysis prompt in an external AI assistant and inspect the returned score locally
- Use Confluence as the broader CoE knowledge hub when teams need richer examples or workshop material

## What It Measures

Five pillars, each with 2-4 questions scored from 1 (`Foundational`) to 4 (`Strategic`):

| Pillar                         | Focus                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| 1 - Ideation and Requirements  | Requirements clarity, impact analysis, and personal delivery reflection                      |
| 2 - Design and Architecture    | Technical planning, pattern reuse, and security thinking                                    |
| 3 - Development Hygiene        | Reviewable PRs, traceability, docs, CI/CD habits, and data integrity                        |
| 4 - Quality Engineering        | Edge-case testing, self-review, and test debt management                                    |
| 5 - Operations and Maintenance | Debuggability, observability, runbooks, and handoff readiness                               |

## Scoring Scale

Per-question scale: 1-4 (Foundational to Strategic)  
Raw score range: dynamic (`0..questionCount * 4`)

| Band rule (by max score) | Label | Meaning |
| --- | --- | --- |
| Below 43% | Foundational | Practices are mostly ad hoc or inconsistent. The recommendation should help the user create the first reviewable artifact. |
| 43% to below 65% | Disciplined | Basic rigor exists. The recommendation should make the practice repeatable and easier to verify. |
| 65% to below 85%, with no pillar below 2.5 | Optimized | The user can responsibly use AI or automation to reduce toil while keeping human accountability. |
| 85% and above, with no pillar below 3.0 | Strategic | The user can turn the practice into a team habit, template, or shared standard. |

The concrete raw cutoffs are computed at runtime from `resolveScoreBands(maxScore)` in [src/lib/scoring.ts](src/lib/scoring.ts), so adding/removing questions automatically rescales all bands.

## Recommendation Model

Dashboard recommendations are meant to be short, practical next actions. The playbook provides deeper `Do / Why / How` guidance, artifacts, and checklists; prompt files are optional drafting aids when a user wants them.

Each recommendation should still answer, directly or through its linked playbook section:

- What should the engineer do next?
- What prompt can they run?
- What artifact should come out of it?
- How should they verify the artifact before trusting it?

Good dashboard recommendation shape:

```text
Create a short ADR before coding. Include context, decision, tradeoffs, one risk, and how reviewers can validate the approach.
```

## Routes

| Route       | Purpose                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| /           | Redirects to `/assessment`                                                    |
| /assessment | Personal questionnaire and repository-analysis prompt entry point             |
| /dashboard  | Latest local result, score breakdown, recommendations, and answer review      |
| /playbook   | Markdown-backed engineering playbook organized by pillar                      |

## Data And Persistence

- Draft answers are stored locally in the browser until submission.
- Submitted questionnaire results are stored in `localStorage` under `assessment-result`.
- Repository-analysis submissions are parsed locally and displayed in the component; they are not sent to a server.
- Clearing browser storage or changing devices removes local results.
- The app does not read from or write to Confluence at runtime.

## Content Sources

- Questions, scoring hints, and recommendations live in [src/data/assessmentTemplate.ts](src/data/assessmentTemplate.ts).
- The playbook lives in [content/playbook.md](content/playbook.md).
- Prompt templates live in [prompts/](prompts/).
- Confluence can host expanded CoE guidance, examples, recordings, and workshop material. Until API access exists, link to Confluence manually from content where useful.

## Repository Analysis (Alternative Assessment Method)

In addition to the manual questionnaire, engineers can use an external repository-analysis prompt to score their projects. This method analyzes observable signals from a repository: clarified requirements, design artifacts, commit and PR evidence, CI/CD configuration, test depth, documentation, operational handoff material, and code organization. It scores only evidence supplied to the assistant; it does not infer team habits from a directory listing or assume production infrastructure that is not shown.

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
5. Paste only the JSON into `/assessment` -> `Repository Analysis`
6. Review the score displayed locally

The submission JSON contains:

- individual question scores
- pillar scores
- raw score
- score level

The repository-analysis flow is local-only. It does not create a persisted dashboard result. Recommendations should point to a concrete artifact or check, such as acceptance criteria, an impact note, a design record, a traceability table, a test plan, or a handoff/runbook checklist.

### Advantages

- No manual scoring effort: analysis is drafted from supplied repository signals
- Language-agnostic: works with repositories in any programming language
- Evidence-focused: scores reflect visible engineering evidence, while missing context is reported as uncertainty
- Repeatable: can be run each cycle to compare progress over time
- Actionable: recommendations stay tied to the repository's actual score level

### Scoring Basis

The prompt analyzes:

- Commit message quality and frequency
- Code review discipline and automation
- Test coverage and CI/CD reliability
- README, architecture docs, and onboarding materials
- Monitoring and incident-response processes

Private recommendations stay outside the JSON and should avoid secrets or sensitive repository details.
