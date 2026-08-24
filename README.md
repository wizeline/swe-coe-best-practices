# SWE Best Practices Pulse

Static self-diagnostic for engineering habits. The tool helps an engineer score their current practices, review their answers, and get practical recommendations with AI prompt guides they can use in their next task.

**Live site:** https://wizeline.github.io/wz-int-swe-best-practices/  
**CoE:** Software Engineering — Excellence & Best Practices

## What This Repo Contains

- A static Next.js app deployed to GitHub Pages
- The self-diagnostic questions, scoring logic, and dashboard recommendations
- A Markdown playbook with prompt templates and practical guidance
- Repository-analysis and Gherkin prompt templates

There is no backend, database, authentication, admin panel, or team-session workflow in the current product. Results are calculated in the browser and stored only in `localStorage` on the user's device.

## Content Sources

The runnable tool uses repo-local content today:

| File | Purpose |
|---|---|
| [src/data/assessmentTemplate.ts](src/data/assessmentTemplate.ts) | Questions, scoring hints, and dashboard recommendations |
| [content/playbook.md](content/playbook.md) | Playbook guidance and prompt templates rendered at `/playbook` |
| [prompts/repo-analysis.md](prompts/repo-analysis.md) | Prompt for AI-assisted repository analysis |
| [prompts/gherkin.md](prompts/gherkin.md) | Prompt for acceptance-criteria drafting |

Confluence can remain the broader knowledge hub for the CoE. Until API access is available, keep useful Confluence links in the playbook or recommendation text rather than trying to read Confluence directly from the app.

## Documentation

| Document | Purpose |
|---|---|
| [PRODUCT.md](PRODUCT.md) | Current product scope and user experience |
| [TECHNICAL.md](TECHNICAL.md) | Static architecture, local workflow, and deployment |
| [FRAMEWORK.md](FRAMEWORK.md) | Human-readable assessment reference generated from the template |
| [AGENTS.md](AGENTS.md) | Contributor and coding-agent rules |

## Common Changes

If you change questions, scoring hints, or recommendations:

1. Update [src/data/assessmentTemplate.ts](src/data/assessmentTemplate.ts)
2. Run `npm run sync:framework`
3. Update [content/playbook.md](content/playbook.md) when the recommendation needs supporting guidance or a prompt template
4. Run `npm run lint`, `npm test`, and `npm run build`
