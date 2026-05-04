## Why

Engineers need a way to quickly assess the engineering maturity of a repository without manual effort. An automated prompt that scans a repository and scores it against the defined five pillars will provide immediate, valuable feedback and encourage adoption of best practices.

## What Changes

- A new prompt will be created that, when given access to a Git repository's context (e.g., file structure, commit history, CI configuration), can analyze it.
- The prompt will automatically score the repository's maturity based on the 5 pillars.
- The prompt will generate tailored recommendations for improvement based on its findings.
- The final score will be stored within the existing assessment form infrastructure for tracking.

## Capabilities

### New Capabilities
- `automated-repo-analysis`: A system to analyze a Git repository's contents and metadata to produce a maturity score and recommendations.

### Modified Capabilities
- None

## Impact

- **New Files**: A new file will be created to house the analysis prompt, likely in the `/prompts` directory.
- **Modified Files**:
    - `src/app/assessment/page.tsx` or `src/components/assessment/AssessmentForm.tsx`: To handle the storage of the score from the automated analysis.
    - `src/lib/storage.ts`: May need modifications to support storing the score.
- **Tooling**: This approach will rely on an external tool or LLM agent capable of browsing a repository's files and running git commands to gather the necessary context for the prompt.