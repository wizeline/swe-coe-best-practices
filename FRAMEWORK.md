# SWE Best Practices Framework — Reference Guide

> **This repository is the canonical source of truth** for Wizeline's Software Engineering Best Practices Framework.  
> All changes to questions, scoring rubrics, pillar definitions, or recommendations must be committed here to take effect across all evaluation tooling.
>
> **Live platform:** https://swe-best-practices.vercel.app/  
> **Assessment source file:** [`src/data/assessmentTemplate.ts`](src/data/assessmentTemplate.ts)  
> **Owners:** Daniel Martinez · Leslye Patiño Ortega  
> **CoE:** Software Engineering — Excellence & Best Practices

---

## Core Philosophy

**Intent and Accountability over Tooling**  
Engineering excellence lives in human intent (defining the *What* and *Why* rigorously) and human accountability (rigorous validation and verification). No tooling replaces these fundamentals.

**The True Role of AI**  
AI and advanced automation do not replace engineering principles — they accelerate them. AI integration is successful only when it explicitly reduces operational toil without compromising systemic quality. Where AI use is restricted, engineers must target the highest standards of manual engineering discipline.

---

## Score State Scale

The framework measures an individual's or team's active operational state. Scores reflect *actual daily habits*, not aspirations or team-level norms.

| Score State | Raw Score Rule | Definition |
|---|---|---|
| **Foundational** | Lower range below Disciplined threshold | Base adherence. The engineer follows standard Definition of Done protocols and coding conventions. Execution is reliable but predominantly ad-hoc, with minimal structural intent modeling or automated accelerators. Focus is on absorbing account-level ecosystem guardrails. |
| **Disciplined** | 43% to below 65% of max raw score | Elite manual rigor. Exceptional autonomous delivery through extreme manual discipline. Characterized by consistent Spec-Driven Development, Docs-as-Code practices, modular architectural isolation, and zero syntax or deployment oversight. |
| **Optimized** | 65% to below 85% of max raw score, with no pillar below 2.5 | Efficiency multiplier. Successfully leverages AI, advanced scripting, and automated workflows to accelerate the elite manual disciplines established at the Disciplined tier. Operating as an "Intelligence Curator," the engineer uses automation to offload toil while retaining 100% human accountability over code quality, edge cases, and design parity. |
| **Strategic** | 85% of max raw score and above, with no pillar below 3.0 | Systemic influence. Operating fully "over-the-loop," orchestrating complex cross-system architectures and agentic development pipelines. Professionals at this level define organization-wide engineering patterns, actively mentor peers, and manage macro-level systemic risks rather than line-level implementations. |

**Per-question scale:** 1 = Foundational · 2 = Disciplined · 3 = Optimized · 4 = Strategic  
**Raw score range:** dynamic (`0..questionCount × 4`) with runtime band resolution in `resolveScoreBands(maxScore)`
**Floor rule:** `Optimized` also requires every pillar average to be at least `2.5`; `Strategic` requires every pillar average to be at least `3.0`.

---

## The Engineering Excellence Cycle

The framework operates as a **continuous quarterly cycle** designed to elevate engineering delivery, optimize workflows, and reinforce performance evaluations.

### Phase 1 — Diagnosis (Assessment)

**Objective:** Capture an honest, data-driven snapshot of an engineer's or team's current development behaviors across the 5 core SDLC pillars.

**Execution:** Each quarter, engineers complete the assessment at [swe-best-practices.vercel.app](https://swe-best-practices.vercel.app/). The platform processes questions from this repository's source code in real-time.

**Output:** A localized scorecard establishing the engineer's current technical delivery state (Foundational / Disciplined / Optimized / Strategic).

### Phase 2 — Action Items (Tactical Roadmap)

**Objective:** Translate the diagnosis report into a personalized, high-value Growth Plan integrated directly into the active development backlog.

**Execution:** Guided by the score report, engineers identify gaps and select **two high-impact improvement actions** for the current sprint cycle (e.g., transitioning documentation to Docs-as-Code, or enforcing Spec-Driven Development).

**Strategic Accelerator Mapping:** The action plan must document how AI assistants, automation tools, or elite manual strategies will be deployed to optimize target workflows without introducing risk or debt.

### Phase 3 — Enablement (Enablement Hub)

**Objective:** Execute the growth plan through hands-on learning, centralized resource deployment, and peer-led Workflow Translation.

**Execution:** The SWE CoE team provides materials and hosts active workshop series tailored to action items (e.g., "Advanced Prompting for Architecture" or "Manual Threat Modeling"). AI Champions and practice mentors act as on-the-ground guides sharing real-world optimization evidence.

### Phase 4 — Audit (Validation)

**Objective:** Systematically verify implementation of agreed improvements and validate concrete engineering evidence before closing the cycle.

**Execution:** A designated practice manager, technical leader, or performance lead conducts an objective review by inspecting live project repositories — bypassing subjective self-reporting.

**Verification Criteria:** Randomized sampling of Pull Requests, Technical Specifications, and Architectural Decision Records (ADRs) to confirm documented evidence matches committed framework benchmarks. Successful validation directly reinforces annual performance reviews.

---

<!-- AUTO-GENERATED:ASSESSMENT_FRAMEWORK:START -->
## Assessment Framework — 5 Pillars

The assessment covers **16 questions across 5 pillars**, each weighted equally at 20% of the total score.

> **Self-assessment instruction:** Select the option that most accurately describes what **you personally do today**, not what your team or project does in general.

---

### Pillar 1 – Ideation & Requirements

*How clearly you define and understand the work before writing a single line of code.*

#### Questions

**Q1 · How do you document requirements before starting a task?**

| Score | Description |
|---|---|
| 1 – Foundational | I start coding from a verbal request or Slack message without writing anything down. |
| 2 – Disciplined | I write a brief summary in the ticket but skip explicit acceptance criteria. |
| 3 – Optimized | I write a formal spec with clear Acceptance Criteria (Given/When/Then) before every task, not just large ones. |
| 4 – Strategic | I validate the spec with the requester before coding, resolve all ambiguous criteria until they are testable, and flag scope risks early. |

---

**Q2 · How do you check what your code will break (impact analysis)?**

| Score | Description |
|---|---|
| 1 – Foundational | I start coding and deal with breakage when it appears in tests or review. |
| 2 – Disciplined | I search the repo for likely affected files before I start, but the analysis is informal and undocumented. |
| 3 – Optimized | Before coding, I map all dependencies my change could affect and document that analysis in the ticket or PR. |
| 4 – Strategic | I share the impact map with owners of affected services, confirm no conflicts, and update it if scope changes mid-task. |

---

**Q3 · How do you track your delivery speed and quality?**

| Score | Description |
|---|---|
| 1 – Foundational | I don't monitor my own delivery speed or PR quality; I focus on finishing tasks. |
| 2 – Disciplined | I check if I hit the sprint deadline but don't track rework, review cycles, or bug rates. |
| 3 – Optimized | I regularly note my cycle times and how often PRs come back with significant comments, and use that to adjust estimates. |
| 4 – Strategic | Each sprint I identify one specific bottleneck from my data and apply a concrete change to address it. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Start writing structured ticket descriptions.** Before coding, add a 'Why / What / Acceptance Criteria' block to your ticket. Example: Add a bulleted list of 3 things that must be true for this ticket to be considered 'Done'. |
| **Disciplined** | **Adopt Gherkin-style Acceptance Criteria.** Write scenarios for each requirement. Example: Write 'Given a logged-in user, When they click buy, Then the cart clears'. Also, list all files you expect to change before coding. |
| **Optimized** | **Leverage AI for requirements normalization.** Use a prompt-based agent to turn raw client inputs into a structured spec. Example: Paste a Slack thread from a PM into an LLM and ask it to generate Jira Acceptance Criteria. |
| **Strategic** | **Coach your team on requirements rigor.** Spread structured requirements practices beyond your own work. Example: Run a 30-minute workshop showing teammates how to turn a vague Slack message into a Gherkin spec, and create a shared ticket template in Jira or Linear that the whole team can reuse. |

---

### Pillar 2 – Design & Architecture

*How you plan your technical solutions, reuse existing code, and handle security.*

#### Questions

**Q4 · How do you find reusable components or patterns?**

| Score | Description |
|---|---|
| 1 – Foundational | I write solutions from scratch without checking if a similar one exists. |
| 2 – Disciplined | I do a manual repo search for similar code but don't consult architecture docs or ADRs. |
| 3 – Optimized | I consult ADRs, shared libraries, or architecture standards before designing my solution and reference them in my approach. |
| 4 – Strategic | When I reuse a pattern, I document or improve it if I find gaps and share my findings with the team. |

---

**Q5 · Do you create a technical plan before coding?**

| Score | Description |
|---|---|
| 1 – Foundational | I start coding directly from the ticket without writing down my approach. |
| 2 – Disciplined | I sketch the approach informally but don't produce a shareable, reviewable artifact. |
| 3 – Optimized | I write a Design Doc with at least one diagram and share it for review before coding starts, for any non-trivial change. |
| 4 – Strategic | I get explicit feedback from a senior engineer or architect, incorporate their input, and update the doc if the design evolves during implementation. |

---

**Q6 · When do you evaluate security risks?**

| Score | Description |
|---|---|
| 1 – Foundational | I don't do explicit security analysis; I trust the platform or framework to handle it. |
| 2 – Disciplined | I apply general security awareness while coding (sanitizing inputs, not hardcoding secrets) but without a dedicated review step. |
| 3 – Optimized | Before coding, I trace data flows and identify at least one threat vector using a lightweight threat model, for every feature involving sensitive data or external inputs. |
| 4 – Strategic | I have my threat model reviewed by a peer before coding, document the mitigations I will apply, and verify them during code review. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Make design visible before coding.** Sketch a simple diagram and search the repo for existing patterns. Example: Take a photo of a whiteboard drawing and attach it to the PR so reviewers understand your intent. |
| **Disciplined** | **Document with ADRs and Threat Models.** Publish a short Design Doc. Example: Use Mermaid.js to create a sequence diagram showing how the frontend, API, and database talk to each other, and document one security risk. |
| **Optimized** | **Adopt AI-assisted design validation.** Query AI for reusable components and design risks. Example: Feed your proposed database schema into an AI agent to find missing indexes, or feed your API sequence diagram to detect missing authentication layers. |
| **Strategic** | **Drive architectural standards across the team.** Turn your design practices into shared team conventions. Example: Write or update the team ADR template, add a mandatory threat-model section, and do at least one design-doc review per sprint as a recurring ritual. |

---

### Pillar 3 – Development Hygiene

*How clean, reviewable, and well-documented your actual code changes are, how reliably you deliver them, and how consistently you protect data integrity.*

#### Questions

**Q7 · How do you manage the size and scope of your Pull Requests (PRs)?**

| Score | Description |
|---|---|
| 1 – Foundational | My PRs mix multiple concerns because I commit everything as I go. |
| 2 – Disciplined | I keep the PR focused on the ticket but don't actively split it when it grows large. |
| 3 – Optimized | I plan a PR sequence before coding: refactors in one PR, behavior changes in another, each with a single stated purpose. |
| 4 – Strategic | After each PR cycle, I review the feedback and use it to improve how I split my next work. |

---

**Q8 · How do you ensure your code does exactly what the ticket asked?**

| Score | Description |
|---|---|
| 1 – Foundational | I implement what seems right and rely on review comments to catch spec misalignments. |
| 2 – Disciplined | I manually test the main flow before opening the PR but don't trace each Acceptance Criterion explicitly. |
| 3 – Optimized | Before merging, I trace each Acceptance Criterion to a specific piece of code or test to confirm nothing was missed. |
| 4 – Strategic | I include a traceability note in my PR description mapping each AC to the code or test that covers it, so reviewers can verify coverage without hunting through the diff. |

---

**Q9 · When do you update the documentation?**

| Score | Description |
|---|---|
| 1 – Foundational | I rarely update documentation; I leave it for later, which often means never. |
| 2 – Disciplined | I update docs after the code is merged when I remember, but it's not a consistent habit. |
| 3 – Optimized | I update documentation in the same PR as the code change, every time, not as an afterthought. |
| 4 – Strategic | After merging, I re-read the docs as if I were a new engineer, fix any gaps I find, and confirm they reflect the actual current behavior. |

---

**Q15 · Is your CI/CD pipeline ensuring reliable and consistent delivery?**

| Score | Description |
|---|---|
| 1 – Foundational | I deploy manually or push to shared branches without relying on a pipeline. |
| 2 – Disciplined | My PRs go through a basic CI pipeline but I don't verify all gates pass before merging; I treat CI as optional. |
| 3 – Optimized | Every change I merge passes all automated quality gates (tests, linting, security checks) in CI, and I follow a deployment process with documented rollback steps. |
| 4 – Strategic | When a gate fails, I investigate root cause rather than just re-running. I actively improve the pipeline when I find gaps. |

---

**Q16 · Are you ensuring data integrity across your system?**

| Score | Description |
|---|---|
| 1 – Foundational | I assume data arrives valid; I don't add explicit validation or DB constraints. |
| 2 – Disciplined | I validate inputs at the entry point but skip deeper constraints like DB-level checks or transactions for related writes. |
| 3 – Optimized | I enforce integrity at every boundary I own: input validation, DB constraints, and transactional logic for multi-step operations, in every feature I build. |
| 4 – Strategic | I write integrity tests that verify my data guarantees in CI and document what my service promises and what it assumes from upstream. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Focus PRs, set up CI, and add input validation.** Scope each PR to a single concern, add a basic CI workflow that runs tests on every PR, and validate inputs at entry points. Example: Add a GitHub Actions step that runs your test suite before a PR can be merged, and write one validation check for an endpoint you own. |
| **Disciplined** | **Enforce single-responsibility PRs, quality gates, and data constraints.** Split refactors from feature PRs, require all CI gates to pass before merging, and enforce DB-level constraints and transactions for related writes. Example: Make PR #1 the refactor and PR #2 the feature; block merges when lint or tests fail; wrap multi-step DB writes in a transaction. |
| **Optimized** | **Automate traceability, pipeline stages, and data observability.** Use AI to plan PR splits and spec-to-code traceability, contribute pipeline improvements (parallelization, environment promotion), and add monitoring for data anomalies. Example: Use an AI tool to generate a PR description from your diff, add a staging promotion gate to CI, and set an alert for unexpected null rates in a key column. |
| **Strategic** | **Set team-wide hygiene standards and automate enforcement.** Make your personal hygiene habits the team default. Example: Propose and merge a PR template that requires a traceability section, add a lint rule that blocks large single-commit PRs, and document rollback procedures in the team runbook. |

---

### Pillar 4 – Quality Engineering

*How thoroughly you test your code and protect against future bugs.*

#### Questions

**Q10 · How do you test for hidden bugs?**

| Score | Description |
|---|---|
| 1 – Foundational | I don't write automated tests; I validate manually or rely on others to find bugs. |
| 2 – Disciplined | I write tests for the main success flow but don't systematically cover failure cases or edge inputs. |
| 3 – Optimized | For every meaningful piece of logic I write, I cover at least one edge case and one failure mode, not just the happy path. |
| 4 – Strategic | Before writing tests, I list the failure modes most likely to cause user impact, prioritize them, and cover the highest-risk ones first. I revisit this list when production issues occur. |

---

**Q11 · How do you verify your logic before merging?**

| Score | Description |
|---|---|
| 1 – Foundational | I open the PR when CI is green and count on reviewers to catch logic issues. |
| 2 – Disciplined | I do a quick re-read of my diff before tagging reviewers but it's not structured; I'm mainly looking for obvious mistakes. |
| 3 – Optimized | I do a structured self-review before every PR: line by line through my diff, verifying each function against the acceptance criteria. |
| 4 – Strategic | Before requesting review, I note the riskiest parts of the change in the PR description and what I verified, guiding reviewers to areas that need the most scrutiny. |

---

**Q12 · How do you handle broken legacy tests or technical debt?**

| Score | Description |
|---|---|
| 1 – Foundational | I skip or comment out failing tests that block progress and leave a note to fix later. |
| 2 – Disciplined | I fix tests my changes directly broke but don't touch legacy debt I didn't cause. |
| 3 – Optimized | When I work in a file, I also clean up or rewrite outdated or flaky tests I find there, even unrelated ones. |
| 4 – Strategic | I proactively identify test debt in areas I work on, propose a cleanup plan, and execute it alongside feature work. I track coverage changes in areas I own over time. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Expand beyond happy-path tests.** Write tests for when things go wrong. Example: If you write a function that divides numbers, write one test for normal numbers, and a second test to see what happens if you divide by zero. |
| **Disciplined** | **Introduce self-audits and test debt cleanup.** Review your own code first. Example: Review your own PR on GitHub before tagging a teammate. Also, commit to rewriting one bad legacy test in the file you are currently editing. |
| **Optimized** | **Adopt AI-assisted QA agents.** Use AI to discover edge cases. Example: Provide your function to an AI and ask, 'Generate 5 unit tests that attempt to break this logic using weird or unexpected inputs.' |
| **Strategic** | **Build a quality culture with shared ownership.** Elevate quality from a personal habit to a team standard. Example: Propose a coverage threshold enforced in CI, present a retrospective item on recurring bug patterns, and pair with a junior engineer on test strategy for one feature per sprint. |

---

### Pillar 5 – Operations & Maintenance

*How easy it is to monitor, debug, and hand off the system you built.*

#### Questions

**Q13 · How easy is it to debug your code in production?**

| Score | Description |
|---|---|
| 1 – Foundational | I don't add feature-specific logging; debugging relies on generic error traces. |
| 2 – Disciplined | I add basic text logs at key steps but they're not structured or consistently queryable. |
| 3 – Optimized | I write structured logs (e.g., JSON with userId, endpoint, errorCode) and set up at least one dashboard or alert before my feature goes to production. |
| 4 – Strategic | After each deploy, I verify my alerts and dashboards reflect actual system behavior, update them as the feature evolves, and document first-response steps for each alert I own. |

---

**Q14 · How easily can another engineer take over your work?**

| Score | Description |
|---|---|
| 1 – Foundational | I finish tasks without leaving context beyond the code; handoff knowledge lives only in my head. |
| 2 – Disciplined | I describe the implementation in the PR description, but that context is buried after merge. |
| 3 – Optimized | I write a KT document (architecture notes, runbook, or README section) and link it from the repo so any engineer can find it independently. |
| 4 – Strategic | I keep my KT documentation current as the feature evolves, share it proactively with teammates who will support it, and review it with them to close any gaps. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Replace text logs with structured logging.** Use logs that are easy to search. Example: Instead of console.log('failed to fetch user'), use logger.error('user_fetch_failed', { userId: id, endpoint: url }). |
| **Disciplined** | **Define Dashboards and a KT guide.** Make your feature observable. Example: Create a Datadog/Grafana dashboard tracking the success rate of your new API endpoint, and add a 'How to Test' section to the README. |
| **Optimized** | **Make observability AI-ready.** Automate documentation. Example: Hook up a tool that automatically publishes your successful PRs and their architectural changes into your company's Confluence or Notion workspace. |
| **Strategic** | **Establish team-wide observability and knowledge standards.** Make observability and knowledge transfer a team expectation, not a personal habit. Example: Propose a runbook template for new features, review the on-call alert backlog as a team quarterly, and mentor one teammate on structured logging in their next feature. |

---
<!-- AUTO-GENERATED:ASSESSMENT_FRAMEWORK:END -->
