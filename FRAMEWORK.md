# SWE Best Practices Self-Diagnostic - Reference Guide

This document is the human-readable reference for the self-diagnostic questions, scoring scale, and recommendations used by the static app.

**Live site:** https://wizeline.github.io/wz-int-swe-best-practices/  
**Assessment source file:** [src/data/assessmentTemplate.ts](src/data/assessmentTemplate.ts)  
**CoE:** Software Engineering - Excellence & Best Practices

## How To Read This Document

- Use this file when you need a readable assessment reference.
- Use [src/data/assessmentTemplate.ts](src/data/assessmentTemplate.ts) when you need the machine-readable source used by the product.
- Run `npm run sync:framework` after changing questions, scoring hints, or recommendations.

## Core Philosophy

- **Intent and accountability over tooling:** Engineering excellence starts with clear intent and strong human accountability. Tooling can accelerate this work, but it does not replace it.

- **The true role of AI:** AI and advanced automation do not replace engineering principles. They are useful only when they reduce toil without weakening quality, rigor, or accountability.

## Public Practice Basis

The self-diagnostic is informed by selected public engineering practices from DORA / Accelerate, SPACE, NIST SSDF, OWASP SAMM, ISO/IEC 25010, and SRE. These references keep the questions grounded in recognizable evidence such as tickets, PRs, tests, CI, docs, runbooks, logs, dashboards, and review artifacts. This is not an official certification, compliance score, or external benchmark.

## Score State Scale

The self-diagnostic measures an individual's current engineering habits. Scores reflect actual daily behavior, not aspirations or team-level norms.

| Score State | Raw Score Rule | Definition |
|---|---|---|
| **Foundational** | Lower range below Disciplined threshold | Base adherence. The engineer follows standard Definition of Done protocols and coding conventions. Execution is reliable but predominantly ad-hoc, with minimal structural intent modeling or automated accelerators. Focus is on absorbing account-level ecosystem guardrails. |
| **Disciplined** | 43% to below 65% of max raw score | Elite manual rigor. Exceptional autonomous delivery through extreme manual discipline. Characterized by consistent Spec-Driven Development, Docs-as-Code practices, modular architectural isolation, and zero syntax or deployment oversight. |
| **Optimized** | 65% to below 85% of max raw score, with no pillar below 2.5 | Efficiency multiplier. Successfully leverages AI, advanced scripting, and automated workflows to accelerate the elite manual disciplines established at the Disciplined tier. Operating as an "Intelligence Curator," the engineer uses automation to offload toil while retaining 100% human accountability over code quality, edge cases, and design parity. |
| **Strategic** | 85% of max raw score and above, with no pillar below 3.0 | Systemic influence. Operating fully "over-the-loop," orchestrating complex cross-system architectures and agentic development pipelines. Professionals at this level define organization-wide engineering patterns, actively mentor peers, and manage macro-level systemic risks rather than line-level implementations. |

**Per-question scale:** 1 = Foundational · 2 = Disciplined · 3 = Optimized · 4 = Strategic  
**Raw score range:** dynamic (`0..questionCount × 4`) with runtime band resolution in `resolveScoreBands(maxScore)`  
**Floor rule:** `Optimized` also requires every pillar average to be at least `2.5`; `Strategic` requires every pillar average to be at least `3.0`.

## Improvement Loop

The current tool supports a lightweight personal improvement loop:

1. Complete the self-diagnostic.
2. Review your score and answers.
3. Pick one or two recommendations for your next real task.
4. Use the suggested prompt to create a reviewable artifact.
5. Verify the artifact with tests, code evidence, a reviewer, or a Confluence/team standard.

Confluence can hold richer CoE guidance, examples, and workshop material. This static app keeps the small actionable subset that users need during assessment and follow-up.

---

<!-- AUTO-GENERATED:ASSESSMENT_FRAMEWORK:START -->
## Self-Diagnostic Assessment — 5 Pillars

The assessment covers **15 questions across 5 pillars**, each weighted equally at 20% of the total score.

> **Self-assessment instruction:** Select the option that most accurately describes what **you personally do today**, not what your team or project does in general.

---

### Pillar 1 – Ideation & Requirements

*How you turn a request into clear work before you start coding.*

#### Questions

**Q1 · When you get a new ticket or Slack request, how do you clarify what needs to be built?**

| Score | Description |
|---|---|
| 1 – Foundational | I start coding from the message or ticket as it was written. |
| 2 – Disciplined | I add a short note or ask one question, and the success criteria stay loose. |
| 3 – Optimized | I write clear acceptance criteria before coding, even for normal-sized tasks. |
| 4 – Strategic | I confirm the criteria with the requester, note open questions, and make sure the work is testable before I start. |

---

**Q2 · Before changing code, how do you check what else might be affected?**

| Score | Description |
|---|---|
| 1 – Foundational | Impact shows up later, through failing tests, QA, or reviewer comments. |
| 2 – Disciplined | I search the repo for related files, without writing down what I found. |
| 3 – Optimized | I note the likely impacted files, flows, or services before coding. |
| 4 – Strategic | I also check with owners of risky areas and update the impact note when the scope changes. |

---

**Q3 · After finishing a ticket, how do you review how the work went?**

| Score | Description |
|---|---|
| 1 – Foundational | I move to the next task and revisit it only if something breaks. |
| 2 – Disciplined | I notice when a ticket took longer than expected, without a recorded reason. |
| 3 – Optimized | I look at review comments, rework, and time spent to plan better next time. |
| 4 – Strategic | I pick one recurring bottleneck each sprint and try a specific change to improve it. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Turn rough requests into clear tickets.** Before coding, add a short Why / What / Done block to the ticket and write the acceptance criteria yourself, then confirm assumptions with the requester. An AI assistant can draft a first pass faster if you want to use one. |
| **Disciplined** | **Make acceptance criteria testable.** Write one Given/When/Then scenario per behavior and add a short impact note. Each scenario should map to a test, manual check, or explicit open question. |
| **Optimized** | **Turn messy input into a clear spec.** Turn Slack threads or vague tickets into a spec with facts, assumptions, risks, and open questions, then review it yourself before implementation. An AI assistant can speed up the first draft if useful. |
| **Strategic** | **Share a better ticket habit.** Create a lightweight Jira, Linear, or Confluence template for context, acceptance criteria, assumptions, risks, and verification. Have a teammate try it and improve it from feedback. |

---

### Pillar 2 – Design & Architecture

*How you choose an approach before changing code.*

#### Questions

**Q1 · Before building something, how do you look for existing code or patterns to reuse?**

| Score | Description |
|---|---|
| 1 – Foundational | I build the solution from scratch. |
| 2 – Disciplined | I search the repo for similar files or components, as a quick, informal check. |
| 3 – Optimized | I check existing code, docs, ADRs, or shared patterns and mention what I reused in my plan or PR. |
| 4 – Strategic | When I find a useful or confusing pattern, I improve the docs or share it so others can reuse it too. |

---

**Q2 · For non-trivial work, how do you explain your technical approach before coding?**

| Score | Description |
|---|---|
| 1 – Foundational | The plan stays in my head and I start coding. |
| 2 – Disciplined | I write a few notes for myself that are not easy for others to review. |
| 3 – Optimized | I write a short design note or diagram and share it before implementing risky or cross-cutting changes. |
| 4 – Strategic | I get feedback from the right people, update the note when the design changes, and link it from the ticket or PR. |

---

**Q3 · When your change touches user data, auth, payments, or external input, how do you think about security?**

| Score | Description |
|---|---|
| 1 – Foundational | I rely on the framework or existing code to handle it. |
| 2 – Disciplined | I avoid obvious mistakes like hardcoded secrets, without a focused security pass. |
| 3 – Optimized | I trace the data flow, name at least one realistic risk, and plan the mitigation before coding. |
| 4 – Strategic | I ask for review on the risk and verify the mitigation in code review or tests. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Look before building from scratch.** Search the repo for similar files, components, or docs before designing. Note one pattern you reused or intentionally rejected in the ticket or PR. |
| **Disciplined** | **Write a small design note.** For risky or cross-cutting work, write a one-page design note with context, decision, tradeoffs, risks, and open questions before coding. |
| **Optimized** | **Stress-test your design before you build.** Review your design for unclear boundaries, security risks, data gaps, failure modes, and missing tests, then turn accepted findings into mitigations or non-goals. An AI assistant can help you run a faster first pass. |
| **Strategic** | **Turn good design notes into a team habit.** Create a practical ADR template for the team with context, options, decision, risks, security, observability, tests, and rollout notes. |

---

### Pillar 3 – Development Hygiene

*How you keep PRs reviewable, verified, and easy to maintain.*

#### Questions

**Q1 · Before you request review or merge, how do you make sure the PR is easy to review and matches the ticket?**

| Score | Description |
|---|---|
| 1 – Foundational | I open the PR once it works, and review is left to catch scope or coverage gaps. |
| 2 – Disciplined | I keep most of the work in one PR and manually test the main flow, without mapping each acceptance criterion. |
| 3 – Optimized | I split refactors, behavior changes, tests, and docs when useful, and map each acceptance criterion to code, tests, or manual verification before merging. |
| 4 – Strategic | I plan the PR sequence early, put the acceptance-criteria mapping in the PR description, and use reviewer feedback to improve how I split future work. |

---

**Q2 · When your change affects how someone uses, runs, or supports the system, when do you update docs?**

| Score | Description |
|---|---|
| 1 – Foundational | Docs updates wait until later. |
| 2 – Disciplined | I update docs when someone asks, or after I remember once the code is done. |
| 3 – Optimized | I update docs in the same PR as the code change. |
| 4 – Strategic | I re-read the docs from a new engineer's point of view and fix gaps after the change lands. |

---

**Q3 · When your code accepts or saves data, how do you prevent bad data from getting through?**

| Score | Description |
|---|---|
| 1 – Foundational | I assume the caller sends valid data. |
| 2 – Disciplined | I validate obvious inputs, and deeper constraints or multi-step consistency stay inconsistent. |
| 3 – Optimized | I validate inputs, enforce constraints where data is stored, and use transactions or equivalent safeguards when needed. |
| 4 – Strategic | I also test and document the data guarantees my code provides and what it expects from callers. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Make the next PR smaller and safer.** Keep your next PR focused on one concern. Add a short note that says what is included, what is out of scope, and which test protects it. |
| **Disciplined** | **Map the ticket to the PR.** Before review, map each acceptance criterion to code, tests, docs, or manual verification. Make missing evidence explicit instead of leaving reviewers to find it. |
| **Optimized** | **Run a PR readiness check.** Before requesting human review, check your PR for blockers around scope, acceptance criteria, tests, docs, data integrity, and rollback notes. An AI assistant can help you run this check faster if you use one. |
| **Strategic** | **Create a reusable PR checklist.** Create a lightweight PR template covering summary, acceptance criteria, tests run, docs changed, risks, rollback, and review notes. |

---

### Pillar 4 – Quality Engineering

*How you catch bugs before users or teammates do.*

#### Questions

**Q1 · When you write tests, how much do you cover beyond the happy path?**

| Score | Description |
|---|---|
| 1 – Foundational | I rely on manual checks or the main demo flow. |
| 2 – Disciplined | I test the main success path, and edge cases and failures are hit or miss. |
| 3 – Optimized | I cover at least one edge case and one failure path for meaningful logic. |
| 4 – Strategic | I list the highest-risk failure modes first and update my test approach when bugs or incidents teach us something. |

---

**Q2 · Before asking for review, how carefully do you review your own diff?**

| Score | Description |
|---|---|
| 1 – Foundational | I open the PR once it works and CI is green. |
| 2 – Disciplined | I skim the diff for obvious mistakes before tagging reviewers. |
| 3 – Optimized | I review the diff against the ticket, tests, and risky branches before requesting review. |
| 4 – Strategic | I tell reviewers which parts are risky and what I already checked. |

---

**Q3 · When you touch an area with flaky tests or old test debt, what do you do?**

| Score | Description |
|---|---|
| 1 – Foundational | I work around broken tests if they block the task. |
| 2 – Disciplined | I fix tests my change directly broke, and older issues stay untouched. |
| 3 – Optimized | I clean up outdated or flaky tests in the area I am already touching when the scope is reasonable. |
| 4 – Strategic | I track recurring test debt, propose cleanup, and improve the area over time. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Add one test that can fail for a real reason.** Add one edge-case or failure-path test to your next change, not only the happy path. Start with the bug a user would most likely notice. |
| **Disciplined** | **Review your diff before others do.** Self-review the riskiest part of your diff before tagging reviewers. Name that risk and what you checked in the PR description. |
| **Optimized** | **Find the tests you missed.** Look for missing tests around invalid input, boundary values, partial failure, repeated actions, and regressions, then keep only the ones that match real product rules. An AI assistant can help you brainstorm gaps faster. |
| **Strategic** | **Turn bug patterns into shared checks.** Turn recurring bugs or review comments into a small team checklist with examples, test patterns, and CI guardrails. |

---

### Pillar 5 – Operations & Maintenance

*How easy it is for you or someone else to debug and support what you ship.*

#### Questions

**Q1 · After your feature ships, how easy is it to know whether it is working?**

| Score | Description |
|---|---|
| 1 – Foundational | I rely on generic errors, user reports, or someone manually checking. |
| 2 – Disciplined | I add basic logs that are not always searchable or tied to clear success/failure signals. |
| 3 – Optimized | I add useful logs, metrics, dashboards, or alerts for the feature before release. |
| 4 – Strategic | I verify the signals after deploy and document what to check first when something looks wrong. |

---

**Q2 · If you are offline, how easily can another engineer understand or support your change?**

| Score | Description |
|---|---|
| 1 – Foundational | Most of the context stays in my head or scattered in chats. |
| 2 – Disciplined | The PR explains the change, and the context is hard to find after merge. |
| 3 – Optimized | I leave a README, runbook, Confluence note, or architecture note linked from the repo or ticket. |
| 4 – Strategic | I keep the handoff material current and review it with people who may support the feature. |

---

**Q3 · How do you treat CI checks and pipeline health when your PR is ready to merge?**

| Score | Description |
|---|---|
| 1 – Foundational | I rely mostly on local checks or manual deploy habits. |
| 2 – Disciplined | I wait for basic CI, and sometimes rerun or ignore failures without digging deeper. |
| 3 – Optimized | I make sure required checks pass and understand what they cover before merging. |
| 4 – Strategic | When CI fails, I look for the root cause and improve the pipeline when I find a real gap. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Add signals someone can search.** Add one searchable signal for your next feature: a structured log, metric, dashboard, or alert that answers a real support question. |
| **Disciplined** | **Leave a handoff note.** Write the minimum handoff another engineer needs: what changed, how to verify it, signals to watch, first debugging steps, rollback or mitigation, and owner. |
| **Optimized** | **Draft a runbook from your PR context.** Draft a runbook from your PR context covering links, dashboards, commands, owners, and rollback steps, then verify every item before sharing it. An AI assistant can speed up the first draft if you use one. |
| **Strategic** | **Create a team handoff standard.** Create a lightweight runbook template for new features with required signals, first-response steps, rollback, ownership, and links. |

---
<!-- AUTO-GENERATED:ASSESSMENT_FRAMEWORK:END -->
