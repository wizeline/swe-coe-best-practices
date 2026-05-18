# Best Practices Execution Playbook

This playbook turns assessment recommendations into practical team habits. Use it when you want concrete next steps for any of the five engineering practice pillars. Content is organized by pillar so the dashboard can link recommendations to the right section. Prefer durable engineering practices over tool-specific tricks.

## Maturity Tracks

To avoid process fatigue and adapt to different team dynamics, execution requirements are structured into two distinct tracks:

- **Foundational Track (Esencial):** Minimum viable practices focused on eliminating basic regressions, ensuring alignment, and stabilizing delivery. Mandatory for all squads.
- **Advanced Track (Avanzado):** High-autonomy practices focused on automated governance, deep resilience, and scale. Intended for mature teams or high-risk services.

---

## Pillar 1 - Ideation & Requirements

Clarify the work before code is written. Start from clarified intent.

Treat the first summary, prompt output, or verbal request as a draft that still needs engineering judgment. Challenge the first framing of the task before you implement it. Rewrite the request into a ticket with Why, What, acceptance criteria, and explicit unknowns.

### Execution Tracks

| Foundational Track (Esencial)                                                                                                                                                                                                        | Advanced Track (Avanzado)                                                                                                                                                                              |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rewrite the raw request into a structured ticket (Why, What, Acceptance Criteria) before touching code. Use an AI assistant to turn a vague request or Slack thread into a first-draft ticket, then review and correct each section. | Conduct formal peer-review/challenge sessions for any ticket with high ambiguity or cross-team dependencies. Explicitly map out product risks and edge-case behaviors during grooming before approval. |

### Jira Board / Ticket Checklist

_Copy the text below directly into your Jira issue description or PR templates:_

```text
h3. 📋 Ideation & Requirements Checklist
- [ ] *Why:* Clear problem statement and who is harmed without this filled.
- [ ] *What:* High-level engineering approach documented (e.g., middleware, configs).
- [ ] *Acceptance Criteria:* At least one Given/When/Then scenario mapped out.
- [ ] *Unknowns:* Explicit list of open questions or technical blind spots identified.
```

### Prompt template: Structured ticket

```text
Convert the request below into an implementation-ready ticket.

Request: "Add a rate limit to the public login endpoint so the same IP
          cannot attempt more than 5 logins per minute."

1. Why: [what problem does this solve and who is harmed without it?]
2. What: [what changes at a high level? e.g. new middleware, config flag, response header]
3. Acceptance criteria:
   Given [precondition]
   When  [action]
   Then  [expected result]
   (add one scenario per distinct behavior)
4. Open questions: [e.g. Should we return 429 or silently delay? Where is the counter stored?]
5. Impact: [which services, endpoints, or teams need to know?]

Replace the example request above with your own and fill every section.
```

---

## Pillar 2 - Design & Architecture (Includes Data Integrity)

Make the intended design visible before implementation locks it in. Treat data consistency as an upfront design constraint, not an afterthought.

**1. Make the design reviewable:** Design issues are cheap to catch when the solution is still abstract. Visibility helps reviewers challenge assumptions about boundaries, reuse, auth, and failure modes before the team spends effort implementing the wrong thing.

**2. Enforce data integrity across services:** Data integrity issues compound over time. Define validation rules at every system boundary, use transactional logic for related writes, and add constraints at the database level.

### Execution Tracks

| Foundational Track (Esencial)                                                                                                                                                                                                                          | Advanced Track (Avanzado)                                                                                                                                                                                                     |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Produce a lightweight design text note or layout diagram for changes modifying database schemas, APIs, or data flows. Explicitly declare 1 rejected alternative, 1 security risk, and enforce strict input validation schemas at the service boundary. | Maintain formal Architecture Decision Records (ADRs) checked into the codebase repository under `/docs/adr`. Design atomic transactions for all multi-step writes across boundaries. Enforce automated database drift checks. |

### Jira Board / Ticket Checklist

```text
h3. 📐 Design & Data Integrity Checklist
- [ ] *Design Artifact:* Linked ADR, diagram, or structured text note to the ticket.
- [ ] *Alternatives:* Stated at least 1 rejected option and why it was discarded.
- [ ] *Security Risk:* Explicitly named 1 security hazard and its mitigation plan.
- [ ] *Data Contracts:* Validation rules defined for all input fields at the system boundary.
- [ ] *Write Boundaries:* Stated whether this requires multi-step transactional logic.
```

### Prompt template: Architecture decision record

```text
I need to decide how to store user sessions for a new authentication flow.
The two main options are a Redis-backed session store and stateless JWTs.
The app runs on multiple Node.js instances behind a load balancer.
Security requirements: tokens must be revocable immediately on logout.

Fill out the following ADR for this decision:

Context:      [describe the situation that forces this decision]
Decision:     [which option and why, in one sentence]
Alternatives: [other options you considered and why you ruled each out]
Tradeoffs:    [what you gain and what you give up]
Security:     [the main risk and how you will mitigate it]
Rollout:      [migration steps, feature flags, or phased delivery if needed]

Replace the session-store example with your own decision and fill every field.
```

### Prompt template: Data integrity review

```text
Review this Prisma schema for a payments service and identify integrity gaps.

model Payment {
  id        String   @id @default(cuid())
  userId    String
  amount    Float
  currency  String
  status    String
  createdAt DateTime @default(now())
}

For each gap found:
- Which field or operation is the problem?
- What could go wrong in production? (give a concrete scenario)
- What is the recommended fix? (constraint, validation rule, or transaction boundary)

Also note: which multi-step operations need a transaction, and where would
you add an alert or monitor to catch data anomalies early?

Replace the Payment model with your own schema and apply the same review.
```

---

## Pillar 3 - Development Hygiene & CI/CD

Keep implementation changes small enough that intent stays visible in code review. Automate the path from code to production safely.

**1. Optimize for reviewability:** Split broad changes into reviewable slices with a single clear objective per PR, and keep docs updates coupled to the behavior they describe. Large undifferentiated PRs hide risk.

**2. Build reliable CI/CD pipelines:** Automate the path from code to production so every delivery is consistent, safe, and reversible. Set up a CI pipeline that runs builds, tests, linting, and security checks automatically on every pull request.

### Execution Tracks

| Foundational Track (Esencial)                                                                                                                                                                                                       | Advanced Track (Avanzado)                                                                                                                                                                                                                            |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Limit PR scope to under 400 lines of code (LOC). Defer unrelated fixes to distinct follow-up tickets rather than bundling them. Ensure automated unit tests and code linters execute on every PR. Block merges on broken pipelines. | Utilize Stacked PR workflows or trunk-based development with explicit feature flags. Integrate automated dependency scanning, static application security testing (SAST), automated environment promotion gates, and standardized 1-click rollbacks. |

### Jira Board / Ticket Checklist

```text
h3. 🚀 Development Hygiene & CI/CD Checklist
- [ ] *Slicing:* Changes split into small, independently deployable PRs (<400 LOC).
- [ ] *Isolation:* No unrelated refactors or secondary bugs fixed in this branch.
- [ ] *Automation Check:* Linting, build compilation, and baseline unit tests passed in CI.
- [ ] *Secrets & Configs:* Any new environment variables added securely to the pipeline.
```

### Prompt template: PR sequence plan

```text
I need to add Google OAuth login to a Next.js app that currently uses
email/password auth. The work touches the auth middleware, the login
page UI, the session cookie logic, and the user profile endpoint.

Break this into the smallest reviewable PR sequence. For each PR:
- Objective: what does this PR do and nothing else?
- Key files: which files or modules change?
- Tests: what needs to be added or updated?
- Out of scope: what explicitly waits for the next PR?

Replace the OAuth example with your own feature and answer each field.
```

### Prompt template: Pipeline review

```text
Review the GitHub Actions workflow below for a Node.js API service.
Identify problems and suggest concrete improvements.

Current workflow:
  on: [push]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - run: npm install
        - run: npm test
        - run: npm run deploy

For each finding, explain:
- What is the gap or risk?
- What is the concrete fix (show the corrected YAML step if relevant)?
- What gate or check is missing that would catch real problems?

Replace the example workflow with your own and apply the same review.
```

---

## Pillar 4 - Quality Engineering

Test the parts most likely to fail, not only the path most likely to demo well. Expand beyond the happy path.

Defects often survive because test planning mirrors the expected success path too closely. For every material change, identify one happy-path test, one edge case, and one failure mode. If you skip one of these, write down why.

### Execution Tracks

| Foundational Track (Esencial)                                                                                                                                                                 | Advanced Track (Avanzado)                                                                                                                                                                |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Write at least one happy-path test and one error-handling/boundary test for all changes modifying core application logic. Require code reviewers to ask what happens when inputs are invalid. | Define rigorous integration tests for external contracts, mock complex side effects safely, and evaluate test suite strength via mutation analysis or automated stress/load simulations. |

### Jira Board / Ticket Checklist

```text
h3. 🧪 Quality Engineering Checklist
- [ ] *Happy Path:* Main success scenario covered with clean unit/integration assertions.
- [ ] *Edge Case:* At least 1 boundary condition checked (extreme values, empty objects, nulls).
- [ ] *Failure Mode:* Explicit test ensuring the application fails gracefully under system stress or bad network calls.
```

### Prompt template: Test coverage check

```text
Here is a function that applies a discount code to a cart total:

function applyDiscount(total: number, code: string): number {
  const discounts: Record<string, number> = { SAVE10: 0.10, SAVE20: 0.20 };
  const rate = discounts[code];
  return total - total * rate;
}

For this function:
1. What is the most likely bug a user would hit in production?
2. List three edge cases the happy path does not cover.
3. What would you mock or stub to isolate this in a unit test?
4. Write the single highest-value test case as code.

Replace the discount function with your own code and apply the same analysis.
```

---

## Pillar 5 - Operations & Maintenance

Leave enough context behind that another engineer can safely operate what you ship. Ship with an operational trail.

The goal is not more documentation for its own sake. The goal is faster diagnosis, safer handoff, and fewer heroics after release. Document the minimum operational context needed to debug, support, and roll back the feature.

### Execution Tracks

| Foundational Track (Esencial)                                                                                                                | Advanced Track (Avanzado)                                                                                                                                                                                          |
| :------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ensure structured logs capture exceptions. Write a 3-step rollback or toggle instruction directly inside the PR description or micro-README. | Configure custom OpenTelemetry domain metrics, structure alerts based on service-level objectives (SLOs), provide end-to-end trace correlation IDs, and maintain an updated automated fallback runbook repository. |

### Jira Board / Ticket Checklist

```text
h3. 🛠️ Operations & Maintenance Checklist
- [ ] *Signals:* Key logging patterns or metrics identified to track health post-deploy.
- [ ] *Symptom & Action:* First triage steps explicitly noted in case of anomalous behavior.
- [ ] *Rollback Vector:* Clear step-by-step instructions to revert changes or turn off feature flags.
- [ ] *Ownership:* Responsible on-call group or squad handle clearly declared.
```

### Prompt template: Operational runbook

```text
I just shipped a background job that sends weekly summary emails to users.
It reads from the database, renders a template, and calls the SendGrid API.
It runs every Monday at 08:00 UTC via a cron job.

Draft a runbook for this feature with the following sections:

Signals to watch:  which metrics or log events indicate the job ran successfully?
First symptom:     what is the first thing that breaks, and how would support notice?
First response:    step-by-step: what do you check first, second, third?
Mitigation:        how do you stop the bleeding without a full rollback?
Rollback:          how do you fully revert if the job is causing harm?
Owner:             who is on-call for this feature?

Replace the email-job example with your own feature and fill every section.
```
