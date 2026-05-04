## ADDED Requirements

### Requirement: Analyze Repository for Maturity Assessment
The system SHALL provide a prompt that allows an engineer to analyze their repository and receive an automated maturity score and recommendations.

#### Scenario: Successful Repository Analysis
- **WHEN** an engineer runs the analysis prompt with their repository context (file listing, commit history, config files)
- **THEN** the LLM SHALL analyze signals across the 5 pillars (code quality, testing, deployment, documentation, process)
- **AND** the LLM SHALL assign scores for each pillar based on observable repository evidence
- **AND** the LLM SHALL calculate a final raw score (0-48) and determine the corresponding maturity level (Foundational, Disciplined, Optimized, Strategic)
- **AND** the LLM SHALL provide tailored recommendations for improvement.

### Requirement: Format Analysis Results as JSON
The prompt SHALL instruct the LLM to format the analysis results into a specific JSON structure.

#### Scenario: Correct JSON Output
- **WHEN** the analysis is complete
- **THEN** the LLM SHALL generate a JSON object containing the pillar scores, the raw score, maturity level, key findings, and recommendations.

### Requirement: Submit Repository Analysis Results
The system SHALL provide a mechanism for the user to submit the analysis JSON.

#### Scenario: Successful Analysis Submission
- **WHEN** a user pastes valid analysis JSON into the designated text area on the `/assessment` page and clicks "Submit Analysis"
- **THEN** the system SHALL parse the JSON and create a new `Submission` record in the database
- **AND** the user SHALL be redirected to the dashboard to see their analysis results.

#### Scenario: Invalid Analysis Submission
- **WHEN** a user pastes invalid or malformed JSON into the text area
- **THEN** the system SHALL display an error message indicating the JSON is invalid
- **AND** a `Submission` record SHALL NOT be created.

### Requirement: Track Score History
The system SHALL store each analysis submission, allowing tracking of maturity scores over time.

#### Scenario: Viewing Score History
- **WHEN** a user has made multiple submissions (via questionnaire, prompt analysis, or both)
- **THEN** the system SHALL retrieve all submissions for that user, ordered by date, showing score progression.