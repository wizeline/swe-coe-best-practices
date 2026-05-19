# SWE Best Practices Pulse

> **This repository is the canonical source of truth** for Wizeline's Software Engineering Best Practices Framework.  
> All changes to questions, scoring rubrics, pillar definitions, or recommendations must be committed here to take effect on the live platform.
>
> **Live platform:** https://swe-best-practices.vercel.app/  
> **CoE:** Software Engineering — Excellence & Best Practices

## Core Documentation

| Document | Purpose |
|---|---|
| [FRAMEWORK.md](FRAMEWORK.md) | **Stakeholder reference** — full framework: pillars, questions, scoring rubrics, recommendations, score scale, and Excellence Cycle |
| [PRODUCT.md](PRODUCT.md) | Product definition, scoring model, platform routes, and repository analysis feature |
| [TECHNICAL.md](TECHNICAL.md) | Engineering setup, architecture, and deployment |
| [AGENTS.md](AGENTS.md) | Agent and contributor rules |

## Assessment Source Files

| File | Purpose |
|---|---|
| [`src/data/assessmentTemplate.ts`](src/data/assessmentTemplate.ts) | Machine-readable source driving the live platform (authoritative) |
| [`FRAMEWORK.md`](FRAMEWORK.md) | Human-readable reference for product and stakeholders |

To update questions, scoring rubrics, or recommendations: edit `src/data/assessmentTemplate.ts` and keep `FRAMEWORK.md` in sync.

## Reference Prompt Templates

- [prompts/gherkin.md](prompts/gherkin.md)
- [prompts/repo-score.md](prompts/repo-score.md)
