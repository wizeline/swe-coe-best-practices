## ADDED Requirements

### Requirement: User can review their latest completed assessment in read-only mode
The system SHALL allow an authenticated user with a completed assessment submission to open a read-only review of their latest personal questionnaire for the current dashboard context.

#### Scenario: Individual assessment results show review access
- **WHEN** a user opens `/dashboard` and has a latest personal submission
- **THEN** the results experience exposes a way to review the completed questionnaire in read-only mode

#### Scenario: Team-session personal results show review access
- **WHEN** a user opens `/dashboard?session=<code>` and has a latest personal submission for that session
- **THEN** the results experience exposes the same read-only review for that session-scoped submission

### Requirement: Read-only review shows each question with the user's selected answer
The system SHALL render the questionnaire review from the canonical assessment template and visually indicate the score selected by the user for each question.

#### Scenario: Review preserves assessment structure
- **WHEN** the read-only questionnaire is displayed
- **THEN** questions are grouped by pillar in the same order as the assessment template

#### Scenario: Selected answer is visible per question
- **WHEN** the read-only questionnaire is displayed
- **THEN** each question shows which score level the user selected

#### Scenario: Answer guidance remains visible
- **WHEN** a question includes score guidance text in the template
- **THEN** the review displays that guidance alongside the selected option so the user can interpret their choice in context

### Requirement: Read-only review does not allow answer mutation
The system SHALL prevent users from changing stored answers from the review surface.

#### Scenario: Inputs are not editable
- **WHEN** a user is viewing the questionnaire in read-only mode
- **THEN** they cannot change a score selection or submit new answers from that surface

#### Scenario: Starting a new assessment remains explicit
- **WHEN** a user wants to answer again after reviewing their questionnaire
- **THEN** they must use the existing assessment entry point rather than editing the reviewed submission in place

### Requirement: Users can review only their own questionnaire data
The system SHALL scope read-only review to the authenticated user's own latest submission in the active personal or team-session context.

#### Scenario: Team owner does not gain participant answer review
- **WHEN** a session owner views the team overview surface
- **THEN** they do not receive access to other participants' question-by-question questionnaires

#### Scenario: Missing personal submission hides review surface
- **WHEN** the dashboard context has no latest personal submission for the authenticated user
- **THEN** the read-only review entry point is not shown