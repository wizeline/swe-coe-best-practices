# SWE Best Practices Pulse

> **This repository is the canonical source of truth** for Wizeline's Software Engineering Best Practices Framework.  
> All changes to questions, scoring rubrics, pillar definitions, or recommendations must be committed here to take effect on the live platform.
>
> **Live platform:** https://swe-best-practices.vercel.app/  
> **CoE:** Software Engineering — Excellence & Best Practices

## What This Repo Contains

This repository serves two audiences at the same time:

- Product and framework owners who need a human-readable reference for the framework
- Engineers who need the app, scoring logic, prompts, and persistence model that power the live platform

## Read This First

| Document | Purpose |
|---|---|
| [FRAMEWORK.md](FRAMEWORK.md) | Full stakeholder-facing framework reference: philosophy, score scale, pillars, questions, and recommendations |
| [PRODUCT.md](PRODUCT.md) | Product behavior, scoring model, routes, and repository analysis workflow |
| [TECHNICAL.md](TECHNICAL.md) | Engineering setup, architecture, persistence, and deployment |
| [AGENTS.md](AGENTS.md) | Contributor and coding-agent rules for this repository |

## Source of Truth

| File | Purpose |
|---|---|
| [`src/data/assessmentTemplate.ts`](src/data/assessmentTemplate.ts) | Machine-readable framework data used by the live product |
| [`FRAMEWORK.md`](FRAMEWORK.md) | Human-readable reference aligned to the assessment template |

If you need to change questions, scoring rubrics, or recommendations:

1. Update `src/data/assessmentTemplate.ts`
2. Update `FRAMEWORK.md`
3. Run the relevant validation steps before merging

## Prompt Templates

- [prompts/gherkin.md](prompts/gherkin.md)
- [prompts/repo-analysis.md](prompts/repo-analysis.md)
