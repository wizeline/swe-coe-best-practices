## Context

The project currently has a web-based assessment form for evaluating engineering maturity based on user answers to 14 questions. The goal is to create an automated analysis prompt that can scan a Git repository and assess its maturity without requiring manual input. The prompt will analyze commit history, test coverage, CI/CD configuration, documentation, and other repository signals to determine a maturity score.

## Goals / Non-Goals

**Goals:**
- Create a self-contained prompt that an engineer can run with their repository context (file structure, commit history, config files).
- The prompt will analyze repository signals across all 5 pillars and assign scores automatically.
- It will provide tailored recommendations based on findings.
- The final score and analysis will be storable in the existing `Submission` data model for tracking over time.
- Support repositories in any language or framework.

**Non-Goals:**
- This will not replace the manual questionnaire; it is an alternative assessment method.
- The initial version will not execute code or make breaking changes; it is read-only analysis.
- The initial version will not support team-based assessments via the prompt.

## Decisions

1.  **Prompt Location and Format**:
    - **Decision**: The prompt will be a new Markdown file located at `prompts/repo-analysis.md`. This keeps it separate from application code but versioned with the repository.
    - **Rationale**: A dedicated file makes it easy to find, update, and share. Markdown is a good format for documentation and instructions.

2.  **Repository Analysis Approach**:
    - **Decision**: The prompt will guide the LLM through a systematic analysis of repository signals: commit history frequency and quality, test coverage ratios, CI/CD configuration, documentation presence, code organization, dependency management, etc.
    - **Rationale**: These signals correlate with the 5 pillars and can be assessed without manual input. The LLM can infer maturity levels based on evidence.

3.  **Scoring Logic in the Prompt**:
    - **Decision**: The prompt will contain scoring rules that map repository signals to pillar scores and an overall maturity level (0-48 scale).
    - **Rationale**: The prompt must be self-contained. The scoring rules will be based on the logic in `src/lib/scoring.ts`, simplified into decision trees for the LLM.

4.  **Data Capture and Storage**:
    - **Decision**: After analysis, the LLM will generate a JSON object containing the findings, pillar scores, raw score, and recommendations. The user will paste this into a new "Import from Analysis" section on the `/assessment` page. A new API endpoint will handle storage.
    - **Rationale**: This keeps the data flow simple and reuses existing infrastructure without requiring the LLM to directly write to the database.

5.  **Tracking Score History**:
    - **Decision**: The existing `Submission` model is sufficient. Each analysis submission creates a new `Submission` record with a timestamp.
    - **Rationale**: No data model changes needed. Score history can be queried per user email.

## Risks / Trade-offs

- **[Risk]** LLM Analysis Accuracy: The LLM's interpretation of repository signals may vary and could be inaccurate for unusual project structures.
    - **Mitigation**: The prompt will have explicit instructions and examples. Manual verification is recommended for critical decisions. The results should be treated as guidance, not gospel.
- **[Risk]** Language Coverage: Not all languages or frameworks will have obvious signals; some are harder to analyze.
    - **Mitigation**: The prompt will work with common signals that apply across languages (commits, tests, CI, docs). Language-specific analysis can be added iteratively.
- **[Risk]** Manual Data Transfer: The user must copy the JSON and paste it into the web app.
    - **Mitigation**: Clear instructions and simple JSON format minimize errors. The submission endpoint has validation.