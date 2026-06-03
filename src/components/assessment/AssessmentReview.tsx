"use client";

import { assessmentTemplate } from "@/data/assessmentTemplate";
import { hintToScoreGuides } from "@/lib/questionOptions";
import { AnswerMap, ScoreValue } from "@/types/assessment";

const scoreLabels: Record<ScoreValue, string> = {
  1: "Foundational",
  2: "Disciplined",
  3: "Optimized",
  4: "Strategic",
};

interface AssessmentReviewProps {
  answers: AnswerMap;
  submittedAt: string;
}

export function AssessmentReview({ answers, submittedAt }: AssessmentReviewProps) {
  const totalQuestions = assessmentTemplate.categories.reduce(
    (total, category) => total + category.questions.length,
    0
  );
  const answeredQuestions = Object.values(answers).filter((answer) => answer !== undefined).length;

  return (
    <article
      id="assessment-review"
      className="card results-content-card assessment-review-card"
      aria-labelledby="assessment-review-title"
    >
      <section className="assessment-review">
        <div className="assessment-review-header">
          <div>
            <h3 id="assessment-review-title">Answer Review</h3>
            <p>
              Read-only view of your latest questionnaire submission from{" "}
              {new Date(submittedAt).toLocaleString()}.
            </p>
          </div>
          <span className="assessment-review-count">
            {answeredQuestions}/{totalQuestions} answered
          </span>
        </div>

        {assessmentTemplate.categories.map((category) => (
          <section key={category.id} className="assessment-review-category">
            <div className="assessment-review-category-header">
              <div>
                <h4>{category.title}</h4>
                <p>{category.description}</p>
              </div>
            </div>

            <div className="assessment-review-questions">
              {category.questions.map((question, index) => {
                const selectedScore = answers[question.id];
                const scoreGuides = hintToScoreGuides(question.hint);
                const options =
                  scoreGuides.length > 0
                    ? scoreGuides
                    : (Object.entries(scoreLabels) as Array<[string, string]>).map(
                        ([score, label]) => ({
                          score: Number(score) as ScoreValue,
                          description: label,
                        })
                      );

                return (
                  <article key={question.id} className="assessment-review-question">
                    <div className="assessment-review-question-header">
                      <div>
                        <p className="assessment-review-question-index">Question {index + 1}</p>
                        <h5>{question.text}</h5>
                      </div>
                      <span className="assessment-review-selected">
                        {selectedScore
                          ? `Selected: ${scoreLabels[selectedScore]}`
                          : "No answer recorded"}
                      </span>
                    </div>

                    <div className="assessment-review-options" role="list" aria-label={question.text}>
                      {options.map((option) => {
                        const isSelected = selectedScore === option.score;
                        const optionId = `${question.id}-review-${option.score}`;

                        return (
                          <label
                            key={option.score}
                            htmlFor={optionId}
                            className={`assessment-review-option ${isSelected ? "assessment-review-option--selected" : ""}`}
                          >
                            <input
                              id={optionId}
                              type="radio"
                              name={`${question.id}-review`}
                              value={option.score}
                              checked={isSelected}
                              disabled
                              readOnly
                            />
                            <span className="assessment-review-option-copy">
                              <span className="assessment-review-option-label">
                                {scoreLabels[option.score]}
                              </span>
                              <span className="assessment-review-option-description">
                                {option.description}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </section>
    </article>
  );
}