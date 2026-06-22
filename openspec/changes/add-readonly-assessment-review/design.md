## Context

The current submission flow stores the user's complete `answers` payload together with the computed `result`, then redirects to `/dashboard`. The dashboard already fetches the latest `SubmissionRecord` for the current user and selected session context, but it only renders score summary, category breakdown, and recommendations.

This means the missing capability is primarily presentation and navigation, not data persistence. The initial design should preserve the current ownership model: users can review only their own submission data, and team-session aggregate views remain separate from personal results.

## Goals / Non-Goals

**Goals:**
- Let a user review the exact answers from their latest completed assessment in a read-only surface.
- Support both individual assessments and the personal-results view for team sessions.
- Reuse the existing assessment template, labels, and hint-to-score mapping so review content stays in sync with the questionnaire.
- Keep the implementation lightweight enough to avoid new persistence or query complexity if current data is sufficient.

**Non-Goals:**
- Full submission history or version comparison.
- Editing answers from the read-only surface.
- Owner access to other participants' individual questionnaires.
- Changes to scoring, submission storage, or team aggregation semantics.

## Decisions

### D1: Scope the first release to the latest personal submission already loaded by the dashboard

**Decision:** The first iteration will render a read-only review for the same latest `SubmissionRecord` that powers the score card.

**Rationale:** This directly satisfies the user need with minimal surface area. It avoids introducing a new detail route, submission selector, or additional API contract before there is evidence that users need historical review.

**Alternative considered:** A dedicated submission-detail route with lookup by submission id. This is cleaner for history and deep linking, but it adds endpoint and navigation work that is not required for the initial outcome.

### D2: Reconstruct the questionnaire from `assessmentTemplate` plus stored `answers`

**Decision:** The read-only review should map over `assessmentTemplate.categories` and `questions`, then resolve each selected score from `submission.answers`.

**Rationale:** The template is the canonical source for question text and option guidance. Reusing it keeps the review layout aligned with the live form and avoids denormalizing question text into submission records.

**Alternative considered:** Rendering from stored `result.categories` alone. That supports pillar summaries but not question-level review, so it is insufficient.

### D3: Use a dedicated presentational component for review mode rather than branching inside the live form

**Decision:** Build a separate read-only questionnaire component, potentially sharing small helper logic, instead of adding a `readOnly` mode to `AssessmentForm`.

**Rationale:** The live form manages onboarding, draft persistence, session validation, wizard navigation, and submission state. Reusing it directly for review would mix editing concerns with a passive display surface and increase regression risk.

**Alternative considered:** Add a read-only prop to `AssessmentForm`. This would maximize markup reuse, but the component currently owns too much interactive state for that to be the safest first move.

### D4: Enter review from the personal results surface

**Decision:** The score/results surface should expose a clear CTA to open the read-only questionnaire for the current submission context.

**Rationale:** Users already land on the dashboard after submitting, so that is the most discoverable location for review without adding a new navigation concept.

**Alternative considered:** Redirect directly from submit into the read-only questionnaire. That would hide the summary-oriented results view and change the current post-submit mental model more than necessary.

## Risks / Trade-offs

- [Question text drift over time] If the assessment template changes later, older submissions will render against current question copy. → Accept for the initial scope because the app already treats the template as the current canonical model; revisit only if historical fidelity becomes a requirement.
- [UI duplication] A dedicated read-only component may duplicate some questionnaire markup. → Keep duplication limited to presentation and extract small helpers only when reuse is clearly beneficial.
- [Scope pressure toward history] Once review exists, users may ask for older submissions too. → Keep the first implementation explicitly tied to the latest submission so the extension path remains additive.

## Migration Plan

No data migration is required. Rollout is a UI-only enhancement backed by existing submission data.

If the feature causes confusion or regressions, it can be rolled back by removing the review CTA and component without affecting stored submissions.

## Open Questions

- Should the review surface expand inline inside the dashboard or navigate to a dedicated page? The design favors an entry from the dashboard but leaves the final presentation choice open for implementation.