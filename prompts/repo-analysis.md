# Repository Analysis Prompt

## Overview

You are an engineering practices analyst. Your task is to analyze a Git repository and score its engineering practices across **5 Pillars** on a scale of 1-4 for each question (16 questions total), resulting in a raw score from 16 to 64 for the current questionnaire.

This self-diagnostic is calibrated by selected public engineering references: DORA / Accelerate, SPACE, NIST SSDF, OWASP SAMM, ISO/IEC 25010, and SRE practices. Use those references to identify observable evidence, but do **not** claim the repository is certified, compliant, officially benchmarked, or externally audited.

The 5 Pillars are:

1. **Ideation & Requirements** (20% weight) – Requirements clarity, impact analysis, delivery tracking
2. **Design & Architecture** (20% weight) – Reuse discovery, technical planning, security analysis
3. **Development Hygiene** (20% weight) – PR scope discipline, spec traceability, docs-as-code, CI/CD reliability, data integrity
4. **Quality Engineering** (20% weight) – Hidden bug testing, logic verification, test debt management
5. **Operations & Maintenance** (20% weight) – Observability and knowledge transfer readiness

## Scale

- **1 = Foundational**: Ad-hoc, manual, inconsistent practices
- **2 = Disciplined**: Basic processes in place, some automation
- **3 = Optimized**: Well-established, mostly automated, measured
- **4 = Strategic**: AI-enhanced, intelligent, continuous learning, predictive

## Repository Context You Will Analyze

You will receive:

1. File/directory structure (including key config files)
2. Recent commit history (last 20-50 commits with messages)
3. CI/CD configuration (GitHub Actions, GitLab CI, Jenkins, etc.)
4. Test setup (test frameworks, coverage indicators)
5. Documentation files (README, docs/, ADRs, etc.)
6. Dependency/lock files (package.json, go.mod, requirements.txt, etc.)
7. Code organization and any visible code quality signals

## Public Reference Calibration

Use these public references as calibration input for evidence gathering:

| Reference family | Evidence to look for |
| --- | --- |
| DORA / Accelerate | CI/CD quality gates, deployment frequency clues, lead-time clues, rollback or change-failure signals, incident or recovery notes |
| SPACE Framework | PR flow, review quality, collaboration signals, work-in-progress control, rework patterns, documentation of tradeoffs |
| NIST SSDF | Secure design evidence, dependency/security checks, input validation, verification, release safeguards |
| OWASP SAMM | Threat modeling, secure implementation practices, security verification, operational security practices |
| ISO/IEC 25010 | Maintainability, reliability, security, usability, testability, and quality attributes visible in code/docs/tests |
| SRE practices | Structured logs, metrics, dashboards, alerts, runbooks, incident response, mitigation, rollback guidance |

The output score remains the questionnaire score. Public references should influence your evidence assessment and private recommendations, not create a separate score.

## Scoring Rules

Score-level bands are dynamic by maximum possible raw score (`maxScore = questionCount * 4`):

- Foundational = below 43% of raw score
- Disciplined = 43% to below 65% of raw score
- Optimized = 65% to below 85% of raw score, and only if every pillar score is at least 2.5
- Strategic = 85% of raw score and above, and only if every pillar score is at least 3.0

For 16 questions (maxScore 64), this maps to:

- Foundational: 0-27
- Disciplined: 28-41
- Optimized: 42-54
- Strategic: 55-64

If a raw score reaches the `Optimized` or `Strategic` range but any pillar misses its floor, downgrade the final `score_level` to the highest band allowed by the pillar floors.

For each pillar, read the 2-3 questions and score them based on observable evidence from the repository.

### Pillar 1: Ideation & Requirements (3 questions)

**Q1.1: Requirement Documentation**

- **1**: No visible requirements docs; vague commit messages
- **2**: Basic README with feature list; commit messages have some context
- **3**: Formal spec files, ADRs, or issue templates; clear commit messages with context
- **4**: AI-generated super-specs, formal requirement management; excellent traceability in commits

**Q1.2: Impact Analysis & Dependency Mapping**

- **1**: No dependency mapping visible; no pre-coding analysis
- **2**: Manual dependency tracking in comments or docs; occasional analysis
- **3**: Clear architecture docs showing service dependencies; impact analysis evident in code reviews
- **4**: Automated dependency graphs; AI-powered impact analysis in PR descriptions

**Q1.3: Delivery Tracking (Velocity, DORA Metrics)**

- **1**: No metrics visible; ad-hoc delivery
- **2**: Sprint tags or milestones; basic commit frequency
- **3**: GitHub Projects, issue milestones, or labels tracking work; regular releases
- **4**: Automated DORA metrics visible (lead time, deployment frequency, MTTR, change failure rate)

### Pillar 2: Design & Architecture (3 questions)

**Q2.1: Reusable Components & Patterns**

- **1**: New code is written without checking for prior implementations
- **2**: Manual searches are done occasionally to find similar code
- **3**: ADRs/shared libraries are consulted before implementation
- **4**: AI knowledge systems are used to retrieve validated building blocks

**Q2.2: Technical Planning Before Coding**

- **1**: Work starts without explicit technical planning
- **2**: Light/implicit planning exists but is not documented
- **3**: Design docs and diagrams are created before implementation
- **4**: AI validation is used to check architecture alignment before coding

**Q2.3: Security Risk Evaluation Timing**

- **1**: Security is assumed or deferred until late stages
- **2**: General best practices are applied informally
- **3**: Threat modeling is done as part of design
- **4**: AI scanners are used to detect design-level security flaws early

### Pillar 3: Development Hygiene (3 questions)

**Q3.1: Pull Request Scope Management**

- **1**: PRs are broad and mix multiple concerns
- **2**: PRs are ticket-focused but often large
- **3**: PRs are single-responsibility and review-friendly
- **4**: AI tooling helps split work into atomic reviewable units

**Q3.2: Spec-to-Code Alignment**

- **1**: Requirements drift during implementation
- **2**: Manual checks are done near completion
- **3**: Code changes are explicitly mapped to acceptance criteria
- **4**: Automated agents validate implementation against spec before PR

**Q3.3: Documentation Update Timing**

- **1**: Documentation is usually skipped
- **2**: Documentation updates happen late/inconsistently
- **3**: Documentation is updated in the same change set as code
- **4**: AI-assisted docs generation/refresh is part of delivery flow

**Q3.4: CI/CD Pipeline Reliability (p2-q15)**

- **1**: No CI pipeline; deployments are manual or ad-hoc
- **2**: Basic CI pipeline exists (build + tests) but quality gates are not enforced consistently
- **3**: All changes pass automated quality gates (tests, linting, security checks) in CI before merge; deployment process includes documented rollback steps
- **4**: Pipeline failures are investigated for root cause; pipeline stages are actively improved when gaps are found (e.g., new gates added, coverage increased)

**Q3.5: Data Integrity Enforcement (p2-q16)**

- **1**: No explicit input validation or DB constraints in application code
- **2**: Input validation exists at entry points but DB-level constraints or transactional logic are inconsistent
- **3**: Integrity is enforced at every boundary: input validation, DB constraints, and transactions for multi-step operations
- **4**: Data guarantees are verified by automated tests in CI; service contracts (what is promised, what is assumed from upstream) are documented

### Pillar 4: Quality Engineering (3 questions)

**Q4.1: Hidden Bug Testing Depth**

- **1**: Few/no automated tests and no edge-case coverage
- **2**: Happy-path tests exist but edge cases are sparse
- **3**: Edge-case checklists and negative-path tests are routine
- **4**: AI QA agents proactively discover overlooked edge cases

**Q4.2: Logic Verification Before Merge**

- **1**: Merge as soon as CI passes
- **2**: Standard peer review only
- **3**: Line-by-line self-audit before review request
- **4**: AI verifier audits logic against requirements before human review

**Q4.3: Legacy Test Debt Handling**

- **1**: Broken legacy tests are ignored/skipped
- **2**: Legacy tests are fixed only when directly impacted
- **3**: Test debt is actively cleaned in touched modules
- **4**: AI agents help repair/update legacy tests continuously

### Pillar 5: Operations & Maintenance (2 questions)

**Q5.1: Monitoring & Observability**

- **1**: No monitoring; errors discovered by users
- **2**: Basic error tracking; manual alerting
- **3**: Structured logging; metrics dashboard; defined SLOs; alerts
- **4**: AI-driven anomaly detection; predictive alerting; auto-remediation

**Q5.2: Incident Response & Incident Management Process**

- **1**: No incident process; ad-hoc response
- **2**: Basic incident log; post-mortems sometimes written
- **3**: Formal incident procedures; RCA process; blameless post-mortems; MTTR tracking
- **4**: AI-powered incident forecasting; automated mitigation; intelligent runbook selection

## Analysis Process

1. **Examine requirements and planning evidence**: Look for issue templates, acceptance criteria, ADRs, impact notes, and traceability between requests and PRs.
2. **Examine commit and PR flow**: Look for PR size, review quality, rework patterns, scope control, and whether changes map to tickets.
3. **Check CI/CD config**: Look for tests, linting, build, security checks, required gates, deployment safety, and rollback hints.
4. **Assess test setup**: Look for edge cases, failure paths, regression tests, flaky/debt handling, and meaningful assertions.
5. **Review documentation**: Look for README quality, architecture notes, ADRs, runbooks, Confluence links, handoff notes, and support guidance.
6. **Evaluate security and data integrity**: Look for validation, constraints, transactions, threat modeling, dependency checks, and secure review practices.
7. **Evaluate operations evidence**: Look for structured logs, metrics, dashboards, alerts, incident notes, mitigation, and rollback instructions.

## Insufficient Data Rule

If the provided context does not contain enough signals to score **at least 3 of the 5 pillars** with reasonable confidence (e.g. only a README was shared, no commit history, no CI config, no test evidence), **do not produce a scored analysis**. Instead output only this JSON object and nothing else:

```json
{ "error": "INSUFFICIENT_DATA", "reason": "<one sentence explaining what is missing>" }
```

Examples of insufficient context:

- Only a README or directory listing with no commit history
- No CI/CD config, no test files, and no code visible
- Fewer than 5 commits in the history and no other signals

## Output Format

After your analysis, produce two sections in this exact order:

1. A `Submission JSON` section containing only the minimal JSON object shown below inside a `json` fenced code block. This is the only part intended to be pasted into the dashboard.
2. A `Private Recommendations` section in Markdown for the user only. This section must stay outside the JSON and must never be included in the submission payload.

The dashboard accepts only raw JSON. The user must copy just the JSON object content and exclude headings, code fences, and private recommendations before submitting.

Privacy rule: keep the JSON minimal. Do not include code snippets, file paths, secrets, hostnames, ticket IDs, customer names, environment-specific identifiers, or free-text findings in the JSON.

The `Private Recommendations` section may be more detailed, but it must still avoid secrets or verbatim sensitive repository content. Summarize patterns and improvement actions at a high level. When useful, mention the public reference family that informs the recommendation, for example "DORA-style delivery evidence" or "NIST SSDF / OWASP SAMM secure design practice". Do not call the result a certification, compliance result, or official benchmark.

```json
{
  "analysis": {
    "pillars": {
      "pillar-1-ideation": {
        "title": "Pillar 1 – Ideation & Requirements",
        "questions": [
          { "id": "p1-q1", "score": 2 },
          { "id": "p1-q2", "score": 2 },
          { "id": "p1-q3", "score": 1 }
        ],
        "pillar_score": 2
      },
      "pillar-2-design": {
        "title": "Pillar 2 – Design & Architecture",
        "questions": [
          { "id": "p2-q4", "score": 3 },
          { "id": "p2-q5", "score": 2 },
          { "id": "p2-q6", "score": 2 }
        ],
        "pillar_score": 2
      },
      "pillar-3-development": {
        "title": "Pillar 3 – Development Hygiene",
        "questions": [
          { "id": "p3-q7", "score": 2 },
          { "id": "p3-q8", "score": 3 },
          { "id": "p3-q9", "score": 2 },
          { "id": "p2-q15", "score": 2 },
          { "id": "p2-q16", "score": 1 }
        ],
        "pillar_score": 2
      },
      "pillar-4-quality": {
        "title": "Pillar 4 – Quality Engineering",
        "questions": [
          { "id": "p4-q10", "score": 2 },
          { "id": "p4-q11", "score": 1 },
          { "id": "p4-q12", "score": 1 }
        ],
        "pillar_score": 1
      },
      "pillar-5-operations": {
        "title": "Pillar 5 – Operations & Maintenance",
        "questions": [
          { "id": "p5-q13", "score": 2 },
          { "id": "p5-q14", "score": 1 }
        ],
        "pillar_score": 1
      }
    },
    "raw_score": 28,
    "score_level": "Optimized"
  }
}
```

Then add a separate Markdown section like this:

```markdown
## Private Recommendations

1. Explain the 3-5 highest-value improvements in plain language.
2. Prioritize them by expected impact and implementation effort.
3. Mention important caveats, blind spots, or missing evidence that could change the score.
4. Keep this section out of the JSON and out of any content the user submits to the dashboard.
```

## Instructions for the User

1. **Gather your repository context**:
   - Run `ls -la` and `tree -L 2` to get the directory structure
   - Run `git log --oneline -50` to get recent commits
   - Paste your `.github/workflows/*.yml`, `package.json`, `Dockerfile`, or other relevant config files
   - Paste key README sections and any architecture/design docs
   - If applicable, share test coverage reports or CI pipeline output

2. **Paste the context above** into this conversation or into an AI agent environment

3. **Wait for the analysis** – I will examine the repository signals and provide a score

4. **Copy only the JSON object content** to submit to the Assessment Dashboard at [your URL here]

5. **Track your progress** – Submit analyses quarterly to measure improvement over time

---

**Note**: This analysis is based on observable repository signals and best-judgment interpretation. It is a guide, not a definitive grade. Use it to identify areas for improvement and prioritize engineering investments.
