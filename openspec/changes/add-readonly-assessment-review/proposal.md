## Why

Users can submit an assessment and see their score summary, but they cannot review the exact answers they chose afterward. That creates unnecessary friction when they want to reflect on their self-assessment, validate why a score was produced, or revisit a team-session submission without re-entering edit mode.

## What Changes

- Add a personal read-only review experience for completed questionnaire submissions.
- Show the user's selected answer for each question using the existing assessment template and score labels.
- Expose the review surface from the personal results experience in both individual assessments and team-session personal results.
- Keep the first iteration scoped to the latest submission already shown in the dashboard; no multi-submission history or editing flow changes.

## Capabilities

### New Capabilities
- `assessment-readonly-review`: Personal read-only review of a completed assessment, including all answered questions and the selected score for each one.

### Modified Capabilities
<!-- No existing spec-level requirements are changing. -->

## Impact

- **UI surface**: `src/components/assessment/DashboardView.tsx` will need a review entry point and a read-only questionnaire presentation.
- **Question rendering**: the solution should reuse `src/data/assessmentTemplate.ts` and existing score-guide helpers so the review stays aligned with the live questionnaire.
- **Data flow**: the current `SubmissionRecord` payload already includes `answers` and `result`, so this change can likely avoid new persistence work for the initial scope.
- **Docs/tests**: feature work should include updated product/technical documentation and targeted coverage for the read-only review behavior.