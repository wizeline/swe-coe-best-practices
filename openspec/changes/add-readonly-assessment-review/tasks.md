## 1. Review Experience

- [x] 1.1 Add a read-only review entry point to the personal results experience in `DashboardView`
- [x] 1.2 Implement a dedicated presentational component that renders the questionnaire in read-only mode from `assessmentTemplate` and `SubmissionRecord.answers`
- [x] 1.3 Ensure the review surface works for both individual results and session-scoped personal results without exposing team aggregate participant answers

## 2. Validation

- [x] 2.1 Add or update targeted tests covering the review entry point, question rendering, and non-editable behavior
- [x] 2.2 Run `npm run lint`
- [x] 2.3 Run `npm test`
- [x] 2.4 Run `npm run build`

## 3. Documentation

- [x] 3.1 Update `PRODUCT.md` to describe that users can review their latest completed questionnaire in read-only mode
- [x] 3.2 Update `TECHNICAL.md` to document the read-only review surface and its reliance on existing submission answer data