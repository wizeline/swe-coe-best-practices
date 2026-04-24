# SWE Best Practices Pulse

Internal tool for self-assessing engineering maturity across five pillars. Developers score 14 practices on a 1–4 scale and receive a maturity label, weighted pillar scores, and prioritized recommendations.

For setup, architecture, and deployment details see [TECHNICAL.md](TECHNICAL.md).

## What It Measures

Five pillars, each with 2–3 questions scored 1 (Foundational) → 4 (Strategic):

| Pillar | Focus |
| ------ | ----- |
| 1 – Ideation & Requirements | Intent Engineering: how rigorously requirements are captured, structured, and traced |
| 2 – Design & Architecture | Systematic Planning: solution design, pattern reuse, and security assessment |
| 3 – Development | Implementation Hygiene: clean, traceable, well-documented code changes |
| 4 – Quality Engineering | Validation & Reliability: testing thoroughness, audit practices, regression protection |
| 5 – Operations & Maintenance | Observability: debuggability, handoff readiness, and operational context |

## Scoring Scale

Per-question scale: 1–4 (Foundational → Strategic)  
Raw score range: 0–48 (14 questions × 4 levels)

| Raw Score | Label | Meaning |
| --------- | ----- | ------- |
| 0–12 | Foundational | Base adherence, ad-hoc execution |
| 13–24 | Disciplined | Elite manual rigor, spec-driven development |
| 25–36 | Optimized | AI-assisted efficiency, intelligence curator |
| 37–48 | Strategic | Systemic influence, agentic orchestration |

## Routes

| Route | Purpose |
| ----- | ------- |
| / | Redirects based on auth state |
| /login | Google sign-in page |
| /assessment | Individual or team-session voting form (auth required) |
| /dashboard | Personal results + owned team session reports (auth required) |

Team session reports include aggregated action items by category, based on team average results for each pillar.

## Future Proposals

- **Cross-team comparison view** — an admin-only page that loads all `AssessmentSession` records, runs `buildTeamStats()` per session, and renders a side-by-side maturity comparison across teams. The data model already supports this; only a protected `/api/admin/sessions` endpoint and a comparison UI are needed.
- **Session invite by email** — let owners invite specific users to a session instead of sharing a public link.
- **Historical trend charts** — plot a team's average score over time when a session is run repeatedly.
