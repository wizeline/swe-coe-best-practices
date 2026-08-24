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

The assessment covers **16 questions across 5 pillars**, each weighted equally at 20% of the total score.

> **Self-assessment instruction:** Select the option that most accurately describes what **you personally do today**, not what your team or project does in general.

---

### Pillar 1 – Ideation & Requirements

*How you turn a request into clear work before you start coding.*

#### Questions

**Q1 · When you get a new ticket or Slack request, how do you clarify what needs to be built?**

| Score | Description |
|---|---|
| 1 – Foundational | I usually start coding from the message or ticket as-is. |
| 2 – Disciplined | I add a short note or ask a quick question, but the success criteria are still loose. |
| 3 – Optimized | I write clear acceptance criteria before coding, even for normal-sized tasks. |
| 4 – Strategic | I confirm the criteria with the requester, call out open questions, and make sure the work is testable before I start. |

---

**Q2 · Before changing code, how do you check what else might be affected?**

| Score | Description |
|---|---|
| 1 – Foundational | I mostly find out when tests fail, QA reports something, or a reviewer points it out. |
| 2 – Disciplined | I search the repo for related files, but I do not write down what I found. |
| 3 – Optimized | I note the likely impacted files, flows, or services in the ticket or PR before coding. |
| 4 – Strategic | I also check with owners of risky areas and update the impact note when the scope changes. |

---

**Q3 · After finishing work, how do you learn from how the ticket went?**

| Score | Description |
|---|---|
| 1 – Foundational | I move to the next task and do not look back unless something breaks. |
| 2 – Disciplined | I notice when a ticket took longer than expected, but I do not track why. |
| 3 – Optimized | I look at review comments, rework, and time spent so I can estimate or plan better next time. |
| 4 – Strategic | I pick one recurring bottleneck each sprint and try a specific change to improve it. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Turn rough requests into clear tickets.** Do: Add a short Why / What / Done block before coding. Prompt: 'Act as a senior product engineer. Convert this request into a concise ticket. Use only the provided context, mark assumptions, list open questions, and write testable acceptance criteria.' Output: ticket draft. Check: every Done item can be observed in the app, API, logs, or tests. |
| **Disciplined** | **Make acceptance criteria testable.** Do: Write one scenario per behavior and note the likely impacted files. Prompt: 'Act as a senior QA-minded engineer. Convert this ticket into Given/When/Then scenarios. Do not invent requirements; put missing details under Open Questions. Also list files or flows likely affected.' Output: scenarios plus impact note. Check: each scenario maps to a planned automated or manual check. |
| **Optimized** | **Use AI to clean up messy input.** Do: Use an assistant to turn Slack threads, notes, or vague tickets into a reviewed spec. Prompt: 'Act as a senior engineer preparing implementation. Summarize the request, separate facts from assumptions, write acceptance criteria, non-goals, dependencies, risks, and questions. Do not fill gaps silently.' Output: reviewed spec. Check: confirm assumptions with the requester before implementation. |
| **Strategic** | **Share a better ticket habit.** Do: Turn your ticket cleanup process into a team template. Prompt: 'Act as an engineering lead. Create a lightweight ticket template for Jira or Linear with sections for context, acceptance criteria, assumptions, risks, and verification. Include guidance for when to ask follow-up questions.' Output: shared template or Confluence note. Check: at least one teammate uses it and gives feedback. |

---

### Pillar 2 – Design & Architecture

*How you choose an approach before changing code.*

#### Questions

**Q4 · Before building something, how do you look for existing code or patterns to reuse?**

| Score | Description |
|---|---|
| 1 – Foundational | I usually build the solution from scratch. |
| 2 – Disciplined | I search the repo for similar files or components, but the check is quick and informal. |
| 3 – Optimized | I check existing code, docs, ADRs, or shared patterns and mention what I reused in my plan or PR. |
| 4 – Strategic | When I find a useful or confusing pattern, I improve the docs or share it so others can reuse it too. |

---

**Q5 · For non-trivial work, how do you explain your technical approach before coding?**

| Score | Description |
|---|---|
| 1 – Foundational | I keep the plan in my head and start coding. |
| 2 – Disciplined | I write a few notes for myself, but they are not easy for others to review. |
| 3 – Optimized | I write a short design note or diagram and share it before implementing risky or cross-cutting changes. |
| 4 – Strategic | I get feedback from the right people, update the note when the design changes, and link it from the ticket or PR. |

---

**Q6 · When your change touches user data, auth, payments, or external input, how do you think about security?**

| Score | Description |
|---|---|
| 1 – Foundational | I rely on the framework or existing code to handle it. |
| 2 – Disciplined | I avoid obvious mistakes like hardcoded secrets, but I do not do a focused security pass. |
| 3 – Optimized | I trace the data flow, name at least one realistic risk, and plan the mitigation before coding. |
| 4 – Strategic | I ask for review on the risk and verify the mitigation in code review or tests. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Look before building from scratch.** Do: Search for similar code and write down what you found. Prompt: 'Act as a senior engineer joining this repo. Given this task and file list, identify existing modules, patterns, or docs I should inspect before designing the solution. Mark uncertain guesses.' Output: reuse checklist. Check: your ticket or PR names at least one reused or intentionally rejected pattern. |
| **Disciplined** | **Write a small design note.** Do: Write a short design note before coding risky work. Prompt: 'Act as a senior engineer reviewing a design. Draft a one-page ADR with context, decision, alternatives, tradeoffs, data flow, security concern, rollout, and open questions. Do not assume missing facts.' Output: ADR or design note. Check: a reviewer can understand the approach before reading the diff. |
| **Optimized** | **Use AI to challenge the design.** Do: Ask an assistant to find holes before the PR exists. Prompt: 'Act as a skeptical staff engineer. Review this design for unclear boundaries, security risks, data integrity gaps, failure modes, simpler alternatives, and missing tests. Separate facts, assumptions, and questions.' Output: design review checklist. Check: every accepted risk has a mitigation, owner, or explicit non-goal. |
| **Strategic** | **Turn good design notes into a team habit.** Do: Share a template that makes design review easier. Prompt: 'Act as an engineering lead. Create a practical ADR template for our team with sections for context, options, decision, risks, security, observability, tests, rollout, and human review of AI suggestions.' Output: team ADR template. Check: new design notes use the template consistently. |

---

### Pillar 3 – Development Hygiene

*How you keep PRs reviewable, verified, and easy to maintain.*

#### Questions

**Q7 · When a task grows, how do you keep the PR easy to review?**

| Score | Description |
|---|---|
| 1 – Foundational | I usually keep everything in one PR once I have started. |
| 2 – Disciplined | I try to stay focused, but refactors, fixes, and feature work often end up together. |
| 3 – Optimized | I split refactors, behavior changes, tests, and docs when that makes review easier. |
| 4 – Strategic | I plan the PR sequence early and use reviewer feedback to improve how I split future work. |

---

**Q8 · Before opening or merging a PR, how do you check that it actually covers the ticket?**

| Score | Description |
|---|---|
| 1 – Foundational | I trust my implementation and expect review to catch mismatches. |
| 2 – Disciplined | I manually test the main flow, but I do not check each acceptance criterion one by one. |
| 3 – Optimized | I map each acceptance criterion to code, tests, or manual verification before merging. |
| 4 – Strategic | I put that mapping in the PR so reviewers can verify coverage quickly. |

---

**Q9 · When your change affects how someone uses, runs, or supports the system, when do you update docs?**

| Score | Description |
|---|---|
| 1 – Foundational | I usually leave docs for later. |
| 2 – Disciplined | I update docs when someone asks or when I remember after the code is done. |
| 3 – Optimized | I update docs in the same PR as the code change. |
| 4 – Strategic | I re-read the docs from a new engineer's point of view and fix gaps after the change lands. |

---

**Q15 · How do you treat CI when your PR is ready?**

| Score | Description |
|---|---|
| 1 – Foundational | I rely mostly on local checks or manual deploy habits. |
| 2 – Disciplined | I wait for basic CI, but I sometimes rerun or ignore failures without digging deeply. |
| 3 – Optimized | I make sure required checks pass and understand what they cover before merging. |
| 4 – Strategic | When CI fails, I look for root cause and improve the pipeline when I find a real gap. |

---

**Q16 · When your code accepts or saves data, how do you prevent bad data from getting through?**

| Score | Description |
|---|---|
| 1 – Foundational | I mostly assume the caller sends valid data. |
| 2 – Disciplined | I validate obvious inputs, but deeper constraints or multi-step consistency are inconsistent. |
| 3 – Optimized | I validate inputs, enforce constraints where data is stored, and use transactions or equivalent safeguards when needed. |
| 4 – Strategic | I also test and document the data guarantees my code provides and what it expects from callers. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Make the next PR smaller and safer.** Do: Keep the next PR to one concern and add one guardrail. Prompt: 'Act as a senior engineer. Split this task into the smallest reviewable PRs. For each PR, list goal, files, tests, docs, risks, and what is out of scope. Do not add unrelated cleanup.' Output: PR plan. Check: the PR description clearly says what is included and excluded. |
| **Disciplined** | **Map the ticket to the PR.** Do: Show how the implementation covers the ticket. Prompt: 'Act as a careful reviewer. Compare this ticket and PR plan. Create a traceability table with acceptance criteria, code areas, tests, docs, and missing evidence. Mark anything uncertain.' Output: traceability table. Check: each acceptance criterion has evidence or an explicit follow-up. |
| **Optimized** | **Use AI for PR readiness checks.** Do: Ask an assistant to review readiness before humans spend time on the PR. Prompt: 'Act as a strict PR reviewer. Given this diff, ticket, and test output, find scope creep, missing acceptance criteria, weak tests, docs gaps, data integrity risks, and unclear rollback notes. Separate blockers from suggestions.' Output: PR readiness checklist. Check: fix blockers before requesting review. |
| **Strategic** | **Create a reusable PR checklist.** Do: Turn your PR habits into a team checklist. Prompt: 'Act as an engineering lead. Create a practical PR template with sections for summary, acceptance criteria coverage, tests run, docs changed, risks, rollback, and AI-assisted review notes. Keep it lightweight.' Output: PR template. Check: the team uses it for at least one feature cycle. |

---

### Pillar 4 – Quality Engineering

*How you catch bugs before users or teammates do.*

#### Questions

**Q10 · When you write tests, how much do you cover beyond the happy path?**

| Score | Description |
|---|---|
| 1 – Foundational | I mostly rely on manual checks or the main demo flow. |
| 2 – Disciplined | I test the main success path, but edge cases and failures are hit or miss. |
| 3 – Optimized | I usually cover at least one edge case and one failure path for meaningful logic. |
| 4 – Strategic | I list the highest-risk failure modes first and update my test approach when bugs or incidents teach us something. |

---

**Q11 · Before asking for review, how carefully do you review your own diff?**

| Score | Description |
|---|---|
| 1 – Foundational | I open the PR once it works and CI is green. |
| 2 – Disciplined | I skim the diff for obvious mistakes before tagging reviewers. |
| 3 – Optimized | I review the diff against the ticket, tests, and risky branches before requesting review. |
| 4 – Strategic | I tell reviewers which parts are risky and what I already checked. |

---

**Q12 · When you touch an area with flaky tests or old test debt, what do you do?**

| Score | Description |
|---|---|
| 1 – Foundational | I work around broken tests if they block the task. |
| 2 – Disciplined | I fix tests my change directly broke, but I usually leave older issues alone. |
| 3 – Optimized | I clean up outdated or flaky tests in the area I am already touching when the scope is reasonable. |
| 4 – Strategic | I track recurring test debt, propose cleanup, and improve the area over time. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Add one test that can fail for a real reason.** Do: Add one edge-case or failure-path test, not only the demo path. Prompt: 'Act as a senior test engineer. For this function or feature, list the happy path, likely edge cases, realistic failure modes, and the single highest-value test to add first. Do not invent product rules.' Output: focused test plan. Check: at least one negative or boundary case is automated. |
| **Disciplined** | **Review your diff before others do.** Do: Self-review the risky parts before requesting review. Prompt: 'Act as a strict reviewer. Audit this diff against the ticket and tests. Identify logic gaps, weak assertions, flaky test risks, missing edge cases, and one small cleanup worth doing now. Separate blockers from nice-to-haves.' Output: self-review note. Check: the PR description names the riskiest area and what you checked. |
| **Optimized** | **Use AI to find tests you missed.** Do: Use an assistant to expand your test thinking, then choose tests yourself. Prompt: 'Act as a QA strategist. Given this code, ticket, and known constraints, propose tests for invalid input, boundary values, partial failure, concurrency or repeated actions, and regression risk. Rank by user impact and mark assumptions.' Output: prioritized test list. Check: merged tests match real behavior, not invented rules. |
| **Strategic** | **Turn bug patterns into shared checks.** Do: Convert repeated bugs into a checklist your team can use. Prompt: 'Act as an engineering lead. Analyze these recent bugs or review comments and create a lightweight quality checklist with examples, test patterns, CI guardrails, and when to apply each item.' Output: team quality checklist. Check: the checklist catches or prevents a recurring issue. |

---

### Pillar 5 – Operations & Maintenance

*How easy it is for you or someone else to debug and support what you ship.*

#### Questions

**Q13 · After your feature ships, how easy is it to know whether it is working?**

| Score | Description |
|---|---|
| 1 – Foundational | I rely on generic errors, user reports, or someone manually checking. |
| 2 – Disciplined | I add basic logs, but they are not always searchable or tied to clear success/failure signals. |
| 3 – Optimized | I add useful logs, metrics, dashboards, or alerts for the feature before release. |
| 4 – Strategic | I verify the signals after deploy and document what to check first when something looks wrong. |

---

**Q14 · If you are offline, how easily can another engineer understand or support your change?**

| Score | Description |
|---|---|
| 1 – Foundational | Most of the context is in my head or scattered in chats. |
| 2 – Disciplined | The PR explains the change, but the context is hard to find after merge. |
| 3 – Optimized | I leave a README, runbook, Confluence note, or architecture note linked from the repo or ticket. |
| 4 – Strategic | I keep the handoff material current and review it with people who may support the feature. |

---

#### Recommendations

| Band | Action |
|---|---|
| **Foundational** | **Add signals someone can search.** Do: Add at least one searchable signal for the feature. Prompt: 'Act as an on-call engineer. For this feature, list the first three questions support would ask if it breaks. Propose logs, metrics, or alerts that answer those questions. Include event names and fields; mark assumptions.' Output: logging and metrics note. Check: each signal can be found in the real logging or monitoring tool. |
| **Disciplined** | **Leave a handoff note.** Do: Write the minimum context another engineer needs. Prompt: 'Act as a senior engineer writing a handoff note. Draft sections for what changed, how to verify it, signals to watch, likely failure symptoms, first debugging steps, rollback or mitigation, owner, and links. Do not invent links or dashboards.' Output: README, runbook, or Confluence note. Check: another engineer can find it without asking you. |
| **Optimized** | **Use AI to draft support docs.** Do: Use an assistant to turn PR context into support-ready docs. Prompt: 'Act as an on-call-ready engineer. From this PR summary, diff, and known monitoring links, draft a runbook with signals, common failures, triage steps, mitigation, rollback, and ownership. Mark every claim that needs verification.' Output: reviewed runbook. Check: all links, dashboards, commands, and rollback steps are real. |
| **Strategic** | **Create a team handoff standard.** Do: Make handoff notes a normal part of delivery. Prompt: 'Act as an engineering lead. Create a lightweight runbook template for new features with required signals, first-response steps, rollback, ownership, links, and rules for reviewing AI-generated drafts.' Output: shared runbook template in Confluence or the repo. Check: every new feature links to a support note. |

---
<!-- AUTO-GENERATED:ASSESSMENT_FRAMEWORK:END -->
