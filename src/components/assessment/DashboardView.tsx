"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AssessmentReview } from "@/components/assessment/AssessmentReview";
import { assessmentTemplate } from "@/data/assessmentTemplate";
import { loadResult, LocalResult } from "@/lib/draftStorage";
import { getPlaybookHrefForCategory } from "@/lib/playbookLinks";
import { getScoreLevelProgress } from "@/lib/scoring";
import { ErrorToast } from "@/components/assessment/ErrorToast";
import { AssessmentResult } from "@/types/assessment";

export function DashboardView() {
  const [localResult, setLocalResult] = useState<LocalResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastError, setToastError] = useState("");

  useEffect(() => {
    try {
      setLocalResult(loadResult());
    } catch (error) {
      setToastError(error instanceof Error ? error.message : "Failed to load results.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="card form-card">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!localResult) {
    return (
      <div className="card form-card empty-state-card">
        <ErrorToast message={toastError} onClose={() => setToastError("")} />
        <div className="empty-state-option">
          <div>
            <strong>Individual assessment</strong>
            <p>Complete the assessment to see your results and action items.</p>
          </div>
          <a href="/assessment" className="button solid">
            Start assessment
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <ErrorToast message={toastError} onClose={() => setToastError("")} />
      <ScoreCard localResult={localResult} />
    </div>
  );
}

function ScoreCard({ localResult }: { localResult: LocalResult }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { result, answers, submittedAt } = localResult;
  const hasQuestionnaireAnswers = Object.values(answers).some((answer) => answer !== undefined);
  const answered = result.categories.reduce((acc, cat) => acc + cat.answered, 0);
  const total = result.categories.reduce((acc, cat) => acc + cat.total, 0);
  const scoreProgress = getScoreLevelProgress(
    result.totalScore,
    result.maxScore,
    result.categories.map((category) => category.score)
  );
  const scoreLevels: AssessmentResult["scoreLevel"][] = [
    "Foundational",
    "Disciplined",
    "Optimized",
    "Strategic",
  ];
  const currentLevelIndex = scoreLevels.indexOf(scoreProgress.currentLevel);
  const levelProgressWidth = `${((currentLevelIndex + 1) / scoreLevels.length) * 100}%`;

  return (
    <div className="dashboard-grid">
      <article className="card score-card primary">
        <header className="score-header">
          <h2>Best Practices Framework Score</h2>
          <p>
            {answered}/{total} answered
          </p>
        </header>

        <div className="score-ring" aria-label="total score">
          <strong>{result.totalScore}</strong>
          <small>/ {result.maxScore}</small>
        </div>

        <p className="score-level">Current level: {scoreProgress.currentLevel}</p>
        <p className="score-next-level">
          {scoreProgress.nextLevel
            ? `Next level: ${scoreProgress.nextLevel}`
            : "Next level: You are already at the top level"}
        </p>

        <div className="progress-wrap" aria-label="score level progress">
          <div className="progress-bar" style={{ width: levelProgressWidth }} />
        </div>

        <div className="level-scale" aria-hidden="true">
          {scoreLevels.map((level, index) => (
            <span
              key={level}
              className={`level-scale-label ${index <= currentLevelIndex ? "level-scale-label--active" : ""}`}
            >
              {level}
            </span>
          ))}
        </div>

        <p className="progress-label">Level scale</p>
        <p className="score-next-level">
          Submitted on: {new Date(submittedAt).toLocaleString()}
        </p>
      </article>

      <aside className="card dashboard-side-card">
        <section className="dashboard-side-section">
          <div className="score-breakdown">
            <h3>Category Breakdown</h3>
            {result.categories.map((category) => (
              <div key={category.id} className="breakdown-row">
                <span>{category.title}</span>
                <div className="breakdown-metric">
                  <strong>{category.score.toFixed(1)} / 4.0</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-side-section dashboard-side-section--actions">
          <h3>Actions</h3>
          <div className="actions">
            {hasQuestionnaireAnswers && (
              <button
                type="button"
                className="button ghost"
                onClick={() => setIsReviewOpen((current) => !current)}
                aria-expanded={isReviewOpen}
                aria-controls="assessment-review"
              >
                {isReviewOpen ? "Hide answers" : "Review answers"}
              </button>
            )}
            <a href="/assessment" className="button solid">
              New Assessment
            </a>
          </div>
        </section>
      </aside>

      <article className="card results-content-card results-content-card--suggestions">
        <section className="suggestions">
          <h3>Actions to Improve</h3>
          {result.categories.flatMap((category) =>
            category.suggestions.map((suggestion) => (
              <article key={suggestion.id} className="suggestion-item">
                <p className="suggestion-category">{category.title}</p>
                <h4>{suggestion.title}</h4>
                <p>{suggestion.action}</p>
                <Link href={getPlaybookHrefForCategory(category.id)} className="suggestion-link">
                  Open playbook
                </Link>
              </article>
            ))
          )}
          {result.categories.every((c) => c.suggestions.length === 0) && (
            <p className="no-suggestions">Great job! Keep maintaining these high standards.</p>
          )}
        </section>
      </article>

      {hasQuestionnaireAnswers && isReviewOpen && (
        <AssessmentReview answers={answers} submittedAt={submittedAt} />
      )}
    </div>
  );
}
