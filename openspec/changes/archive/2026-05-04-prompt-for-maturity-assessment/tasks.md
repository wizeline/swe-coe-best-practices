## 1. Repository Analysis Prompt Creation

- [x] 1.1 Create the new prompt file at `prompts/repo-analysis.md`.
- [x] 1.2 Populate the prompt with instructions for the LLM to analyze a repository: commit history patterns, test coverage indicators, CI/CD configuration, documentation presence, code organization, and dependency management.
- [x] 1.3 Include scoring rules in the prompt that map repository signals to the 5 pillars and overall maturity level (0-48 scale), based on `src/lib/scoring.ts` logic.
- [x] 1.4 Add instructions for the user to provide their repository context (file structure, recent commits, config files) and for the LLM to generate the final JSON analysis output.

## 2. Backend Implementation

- [x] 2.1 Create a new API route handler, `src/app/api/submissions/analysis/route.ts`, to handle POST requests with the analysis JSON from the prompt.
- [x] 2.2 In the new route handler, add validation to ensure the incoming JSON contains all required fields (pillar scores, raw score, maturity level, recommendations).
- [x] 2.3 Implement the logic to create a new `Submission` record in the database from the validated analysis JSON data.
- [x] 2.4 Modify `src/lib/storage.ts` to add a new function, `submitRepositoryAnalysis(analysisData: string)`, that sends the analysis JSON to the new API endpoint.

## 3. Frontend Implementation

- [x] 3.1 In `src/app/assessment/page.tsx` (or its child components), add a new UI section for submitting repository analysis results.
- [x] 3.2 This section should include a `<textarea>` for the user to paste the analysis JSON output and display the parsed analysis (pillars, score, recommendations).
- [x] 3.3 Add a "Submit Analysis" button that calls the `submitRepositoryAnalysis` function from `src/lib/storage.ts`.
- [x] 3.4 Implement error handling to display a message if the submission fails (e.g., invalid JSON or missing required fields).

## 4. Testing

- [x] 4.1 Add unit tests for the new `submitRepositoryAnalysis` function in `src/lib/storage.ts`, mocking the `fetch` call.
- [x] 4.2 Add integration tests for the new API endpoint with valid and invalid analysis JSON payloads.
- [x] 4.3 Add tests for the frontend analysis submission UI, including error state handling.

## 5. Documentation

- [x] 5.1 Update `AGENTS.md` to mention the new repository analysis prompt and guidelines for maintaining it alongside the core scoring logic.
- [x] 5.2 Add instructions to `PRODUCT.md` or `README.md` explaining how users can run the prompt to analyze their repositories.