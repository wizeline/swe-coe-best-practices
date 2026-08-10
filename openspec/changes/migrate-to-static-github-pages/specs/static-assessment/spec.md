## ADDED Requirements

### Requirement: Anonymous individual assessment
The tool SHALL allow any user to complete the self-assessment without authentication. No login, session, or identity is required.

#### Scenario: Assessment accessible without login
- **WHEN** a user navigates to `/assessment`
- **THEN** the assessment form is displayed immediately with no redirect to a login page

### Requirement: Client-side score calculation
The system SHALL calculate the assessment result entirely in the browser using `calculateAssessment()` upon form submission.

#### Scenario: Result calculated locally on submit
- **WHEN** a user completes all questions and submits the form
- **THEN** `calculateAssessment()` is called with the answers and the result is computed without any network request

### Requirement: Result persisted to localStorage
After submission, the system SHALL write `{ result, answers, submittedAt }` to `localStorage` under the key `assessment-result` so the dashboard can read it.

#### Scenario: Result written to localStorage on submit
- **WHEN** a user submits a completed assessment
- **THEN** `localStorage.setItem('assessment-result', ...)` is called with the serialized result before navigation to `/dashboard`

#### Scenario: Dashboard reads result from localStorage
- **WHEN** a user navigates to `/dashboard`
- **THEN** the dashboard reads the result from `localStorage` under `assessment-result` and displays the score card

#### Scenario: Dashboard shows empty state when no result exists
- **WHEN** a user navigates to `/dashboard` with no result in `localStorage`
- **THEN** the dashboard shows a prompt to start the assessment with a link to `/assessment`

### Requirement: Draft autosave preserved
The system SHALL continue to autosave in-progress answers to `localStorage` as the user fills out the form, using the existing `draftStorage` mechanism.

#### Scenario: Draft restored on revisit
- **WHEN** a user has partially completed the assessment and returns to `/assessment`
- **THEN** their previous answers are restored from `localStorage`

### Requirement: Read-only answer review on dashboard
The dashboard SHALL display a read-only review of all answered questions alongside the score card, using the `answers` stored in `localStorage`.

#### Scenario: Review visible after submission
- **WHEN** a user views the dashboard after completing an assessment
- **THEN** `AssessmentReview` is rendered showing each question and the selected score label

### Requirement: Repository analysis prompt accessible without authentication
The `RepositoryAnalysisSubmission` component SHALL be accessible and functional without authentication. It SHALL support copying the analysis prompt and parsing a JSON result to display locally, but SHALL NOT submit data to any API.

#### Scenario: Prompt copy works without login
- **WHEN** a user clicks "Copy prompt" in the repository analysis section
- **THEN** the prompt text is copied to clipboard without any authentication check

#### Scenario: JSON result displayed locally
- **WHEN** a user pastes valid analysis JSON and clicks submit
- **THEN** the result is displayed in the UI without any network request
