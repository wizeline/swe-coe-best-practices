# Best Practices Self-Diagnostic Playbook

This playbook turns self-diagnostic recommendations into practical next steps. Use it when you want a prompt, artifact, or review checklist for one of the five engineering practice pillars. Content is organized by pillar so the dashboard can link recommendations to the right section.

The tool is static and does not connect to Confluence directly. Keep Confluence as the broader knowledge hub for team standards, examples, and workshop material; use this playbook as the lightweight, repo-versioned guide that can be rendered in the self-diagnostic.

When using an AI assistant, treat every prompt output as a draft. The useful pattern is: ask the agent to structure the work, produce a concrete artifact, then verify the artifact against real code, tests, owners, and project constraints. The guidance is informed by public practices such as DORA, SPACE, NIST SSDF, OWASP SAMM, ISO/IEC 25010, and SRE, without treating them as a separate score or certification.

## Prompting Pattern For Every Recommendation

Use this pattern when adapting any playbook prompt to your work.

### Turn advice into a verified artifact

Start with the recommendation, ask for a concrete output, and keep responsibility with the engineer.

#### Do this

Ask the assistant for one artifact you can attach to the ticket, PR, repo, or Confluence page: acceptance criteria, ADR, PR plan, test plan, traceability table, or runbook.

#### Why this works

Agent outputs become useful when they leave reviewable evidence behind. A prompt that only gives advice is easy to ignore; a prompt that produces an artifact can be checked, improved, and reused.

#### How to

Use this base prompt and replace the bracketed sections with your real context.

**Prompt template: Verified engineering artifact**

```text
Act as a senior engineer helping me prepare a reviewable artifact.

Context:
- Task: [what I am trying to build or change]
- Repo area: [files, modules, service, page, or workflow involved]
- Constraints: [product, security, platform, timeline, compatibility]
- Evidence I have: [ticket, Slack thread, code, PR diff, logs, screenshots, docs]

Rules:
- Use only the context I provide.
- Do not invent requirements, links, dashboards, APIs, or business rules.
- Mark assumptions clearly.
- Put missing information under Open questions.
- Keep the scope small enough for one engineer to act on.

Create this artifact:
- Type: [acceptance criteria | ADR | PR plan | test plan | traceability table | runbook]
- Audience: [reviewer | QA | on-call engineer | future maintainer | requester]

Output format:
1. Summary
2. Artifact
3. Assumptions
4. Risks
5. Open questions
6. Human verification checklist

End with the exact things I must verify before I trust or share this output.
```

## Pillar 1 - Ideation & Requirements

Clarify the work before code is written.

### Start from clarified intent

Treat the first summary, prompt output, or verbal request as a draft that still needs engineering judgment.

#### Do this

Challenge the first framing of the task before you implement it. Rewrite the request into a ticket with `Why`, `What`, acceptance criteria, and explicit unknowns.

#### Why this works

Most delivery mistakes start before coding: vague scope, hidden assumptions, and missing impact analysis. Teams that force clarity early avoid churn later, regardless of whether the first draft came from a PM, a teammate, or an AI assistant.

#### How to

Rewrite the raw request into a structured ticket with `Why`, `What`, and `Acceptance Criteria` before touching code. Use an AI assistant to turn a vague request or Slack thread into a first-draft ticket, then review and correct each section before adopting it.

Ask a teammate to challenge your assumptions before implementation starts, especially for new integrations or ambiguous scope. Every meaningful task needs three sections: `Why`, `What`, and `Acceptance Criteria`.

Project reference: `prompts/gherkin.md`

**Prompt template: Structured ticket**

```text
Act as a senior product engineer turning a rough request into a clear ticket.

Request:
"""
[Paste the Slack message, Jira note, client ask, or verbal summary]
"""

Known context:
- Product area: [page, workflow, API, integration, user role]
- Constraints: [timeline, platform, security, compatibility, rollout]
- Current behavior: [what happens today, if known]

Rules:
- Do not invent requirements.
- Mark assumptions explicitly.
- Put missing details under Open questions.
- Acceptance criteria must be testable.

Output exactly:
1. Why
2. What
3. Acceptance criteria in Given/When/Then format
4. Out of scope
5. Risks
6. Open questions
7. Human verification checklist
```

## Pillar 2 - Design & Architecture

Make the intended design visible before implementation locks it in.

### Make the design reviewable

Use the playbook to force architecture decisions into a visible artifact, even if the first draft is just a sketch.

#### Do this

Create a small design artifact before coding: a diagram, an ADR stub, or a written decision note with tradeoffs and security implications.

#### Why this works

Design issues are cheap to catch when the solution is still abstract. Visibility helps reviewers challenge assumptions about boundaries, reuse, auth, and failure modes before the team spends effort implementing the wrong thing.

#### How to

Before coding, produce a small design artifact: a diagram, an ADR stub, or a written decision note. Even a rough sketch is enough to get meaningful review. Use an AI assistant to draft an ADR, enumerate alternatives, or surface missing security considerations, then validate the output against the actual codebase and your team's standards.

In the artifact, explicitly state one security risk and at least one alternative you rejected and why. For changes touching data flow, APIs, or auth, a diagram or ADR note is required before merge.

Good artifact contents: context, decision, alternatives considered, tradeoffs, rollout notes, and one explicit security risk.

**Prompt template: Architecture decision record**

```text
Act as a senior engineer reviewing a proposed technical approach.

Change I am planning:
"""
[Describe the feature, bug fix, migration, or refactor]
"""

Current context:
- Repo area: [files/modules/services/pages]
- Existing pattern I found: [link, file, ADR, or "unknown"]
- Constraints: [security, performance, compatibility, deployment, static/runtime limits]
- Options considered: [option A, option B, option C]

Rules:
- Separate facts from assumptions.
- Do not claim a pattern exists unless I provided evidence.
- Include at least one rejected alternative.
- Include one security or data-risk consideration when relevant.

Output exactly:
1. Context
2. Decision
3. Alternatives considered
4. Tradeoffs
5. Risks and mitigations
6. Tests and validation
7. Rollout or rollback notes
8. Open questions
9. Human review checklist
```

## Pillar 3 - Development Hygiene

Keep implementation changes small enough that intent stays visible in code review.

### Optimize for reviewability

Use AI only as an accelerator for mechanical work, not as a substitute for PR structure or code ownership decisions.

#### Do this

Split broad changes into reviewable slices with a single clear objective per PR, and keep docs updates coupled to the behavior they describe.

#### Why this works

Large undifferentiated PRs hide risk. When changes are sliced by responsibility, reviewers can reason about naming, architecture, and regression risk instead of scanning noise. This improves quality even on teams that never use AI.

#### How to

Outline the PR sequence in the ticket or PR description before coding: which slice goes first, what stays out of scope, what follows. Use an AI assistant to propose how to split a broad change into reviewable PRs, then validate the boundaries yourself so refactors, behavior changes, and docs updates stay coherent.

Defer unrelated fixes to follow-up tickets rather than bundling them in. Each PR should answer one question clearly: refactor, new behavior, or documentation alignment. If the PR summary needs multiple paragraphs to explain scope, the slice is probably too large.

**Prompt template: PR sequence plan**

```text
Act as a senior engineer helping me split work into reviewable PRs.

Task:
"""
[Describe the feature, bug fix, refactor, or docs change]
"""

Known affected areas:
- Files/modules: [list known files or "unknown"]
- Tests: [known test files or test gaps]
- Docs: [README, Confluence, runbook, product docs]
- Constraints: [deadline, compatibility, rollout, risk]

Rules:
- Keep each PR focused on one reason to review.
- Separate refactor, behavior, tests, and docs when useful.
- Do not hide unrelated cleanup inside the plan.
- Call out dependencies between PRs.

Output as a table with columns:
- PR
- Objective
- Key files
- Tests
- Docs
- Out of scope
- Review risk

End with the smallest safe first PR.
```

### Build reliable CI/CD pipelines

Automate the path from code to production so every delivery is consistent, safe, and reversible.

#### Do this

Set up a CI pipeline that runs builds, tests, linting, and security checks automatically on every pull request. Add a deployment stage with environment promotion and rollback capabilities.

#### Why this works

Manual deployments and local-only testing introduce inconsistency and risk. A well-structured CI/CD pipeline catches problems early, enforces shared quality standards, and makes rollbacks predictable, reducing the cost of every release.

#### How to

Start with a minimal workflow that runs tests on every PR, then incrementally add linting, security scans, and deployment stages. Use an AI assistant to generate a pipeline config as a starting point, then review every step for correctness, security gaps, and coverage before committing it.

Block merges when CI fails and treat a broken pipeline as a production incident. Pipeline changes go through the same review process as application code. Useful additions include environment-specific secrets management, deployment gates between staging and production, and automated smoke tests post-deploy.

**Prompt template: Pipeline review**

```text
Act as a senior engineer reviewing a CI/CD workflow for release safety.

Workflow or pipeline config:
"""
[Paste the workflow YAML or pipeline steps]
"""

Context:
- Project type: [frontend, API, static site, package, mobile, etc.]
- Required checks: [lint, tests, build, security, deploy]
- Deployment target: [if any]

Rules:
- Do not assume tools that are not shown or mentioned.
- Separate blockers from improvements.
- Prefer concrete, minimal fixes.
- Flag any step that deploys before quality gates pass.

Output exactly:
1. Blockers
2. Recommended fixes
3. Missing checks
4. Safer pipeline order
5. Human verification checklist
```

### Enforce data integrity across services

Treat data consistency as a design constraint, not an afterthought.

#### Do this

Define validation rules at every system boundary, use transactional logic for related writes, and add constraints at the database level. Document what guarantees each service provides and what it assumes from its inputs.

#### Why this works

Data integrity issues compound over time. Inconsistent records and silent corruption are hard to detect and expensive to recover from. Teams that design for correctness at the boundary, with clear contracts, validation, and observability, prevent entire categories of bugs from reaching production.

#### How to

Design validation rules at every boundary you own: API inputs, service contracts, and DB constraints, as part of the feature design, not as an afterthought. Use an AI assistant to review an API schema or data model for missing constraints, edge cases, or unvalidated fields, then evaluate each suggestion against actual business rules before applying it.

Treat any unvalidated input reaching business logic as a defect and enforce it in code review. Good evidence of strong integrity practice: input validation at the API boundary, constraints in the DB schema, transactional writes for multi-step operations, and at least one test for an invalid-input scenario.

**Prompt template: Data integrity review**

```text
Act as a senior engineer reviewing data integrity for a change.

Context:
- Feature or workflow: [what data is created, changed, or deleted]
- Inputs: [forms, API payloads, jobs, imports, events]
- Storage or state: [database table, local storage, cache, external system]
- Code or schema:
"""
[Paste relevant schema, validation code, reducer, API contract, or data model]
"""

Rules:
- Do not invent business rules.
- Mark assumptions and ask questions for missing constraints.
- Look for invalid input, missing required fields, duplicate data, race conditions, partial writes, and rollback needs.

Output as a table:
- Risk
- Where it appears
- Production scenario
- Recommended guardrail
- Test to add

End with open questions and the first fix to implement.
```

## Pillar 4 - Quality Engineering

Test the parts most likely to fail, not only the path most likely to demo well.

### Expand beyond the happy path

Use the playbook to expose edge cases, review gaps, and silent failure modes before merge.

#### Do this

For every material change, identify one happy-path test, one edge case, and one failure mode. If you skip one of these, write down why.

#### Why this works

Defects often survive because test planning mirrors the expected success path too closely. Teams that explicitly test boundary conditions and recovery behavior catch bugs that optimistic implementations or optimistic AI-generated tests tend to miss.

#### How to

Before writing tests, identify one happy-path case, one edge case, and one failure mode for every material change. Use an AI assistant to generate additional test scenarios for a function or module, then compare each one against real invariants, production incidents, and regression history before accepting it.

During PR review, ask what happens when inputs are invalid, external calls fail, or state is partially updated. Require reviewers to name the riskiest untested branch before approval. Good evidence: unit tests for logic, integration tests for contracts, and one note about observability or debugging signals.

**Prompt template: Test coverage check**

```text
Act as a senior test engineer looking for bugs before users do.

Code, behavior, or ticket:
"""
[Paste the function, component behavior, ticket, or PR summary]
"""

Known constraints:
- User impact: [who is affected]
- Data rules: [known rules or "unknown"]
- Dependencies: [APIs, storage, browser, time, network, permissions]

Rules:
- Do not invent product rules.
- Mark assumptions clearly.
- Prioritize tests by real user or production risk.
- Include at least one happy path, one edge case, and one failure path.

Output exactly:
1. Risk summary
2. Test scenarios ranked by value
3. Highest-value test to add first
4. What to mock or stub
5. Gaps or open questions
6. Human verification checklist
```

## Pillar 5 - Operations & Maintenance

Leave enough context behind that another engineer can safely operate what you ship.

### Ship with an operational trail

The goal is not more documentation for its own sake. The goal is faster diagnosis, safer handoff, and fewer heroics after release.

#### Do this

Document the minimum operational context needed to debug, support, and roll back the feature: signals, failure symptoms, ownership, and first debugging steps.

#### Why this works

Maintainability depends on what future engineers can see when things go wrong. AI can help draft support notes, but teams still need clear ownership, observability, and rollback thinking embedded in delivery.

#### How to

Before shipping, document the minimum operational context: signals to watch, failure symptoms, first debugging steps, and how to roll back. Use an AI assistant to draft a runbook or handoff note, then verify every monitoring reference, config detail, and rollback statement against the actual system before publishing it.

Every change that affects operations should state what to watch, where to look first, and how to reduce blast radius. Minimum checklist: signals to watch, common failure modes, mitigation options, and who owns the area.

**Prompt template: Operational runbook**

```text
Act as an on-call-ready engineer writing a practical runbook.

Feature or change:
"""
[Describe what changed and how users or systems interact with it]
"""

Known context:
- Owner: [team/person or "unknown"]
- Where to observe it: [logs, dashboard, alert, browser console, support queue]
- Rollback or mitigation: [known steps or "unknown"]
- Links: [real links only]

Rules:
- Do not invent dashboards, commands, links, owners, or alerts.
- Mark missing operational details as Open questions.
- Write for an engineer who is supporting this while you are offline.
- Keep steps concrete and ordered.

Output exactly:
1. What changed
2. Signals to watch
3. Common failure symptoms
4. First response steps
5. Mitigation
6. Rollback
7. Owner and links
8. Open questions
9. Human verification checklist
```
