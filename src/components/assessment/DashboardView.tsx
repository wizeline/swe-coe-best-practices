"use client";

import { useEffect, useState } from "react";
import { getLatestSubmissionByEmail } from "@/lib/storage";
import { AssessmentResult, SubmissionRecord } from "@/types/assessment";

interface DashboardViewProps {
  userEmail: string;
}

export function DashboardView({ userEmail }: DashboardViewProps) {
  const [userSubmission, setUserSubmission] = useState<SubmissionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        const latest = await getLatestSubmissionByEmail();
        if (active) {
          setUserSubmission(latest);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
        if (active) {
          setUserSubmission(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="card form-card">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!userSubmission) {
    return (
      <div className="card form-card">
        <p>No assessment data found for your account yet.</p>
        <div className="empty-actions">
          <a href="/assessment" className="button solid">
            Go to Assessment Form
          </a>
        </div>
      </div>
    );
  }

  return <ScoreCard result={userSubmission.result} email={userEmail} />;
}

interface ScoreCardProps {
  result: AssessmentResult;
  email: string;
}

function ScoreCard({ result, email }: ScoreCardProps) {
  const answered = result.categories.reduce((acc, cat) => acc + cat.answered, 0);
  const total = result.categories.reduce((acc, cat) => acc + cat.total, 0);

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

        <p className="maturity">{result.maturityLabel}</p>

        <div className="progress-wrap" aria-label="completion">
          <div className="progress-bar" style={{ width: `${result.completion}%` }} />
        </div>
        <p className="progress-label">Completion {result.completion}%</p>
        <p className="email-badge">Submitted by: {email}</p>
      </article>

      <aside className="card dashboard-side-card">
        <section className="dashboard-side-section">
          <div className="score-breakdown">
            <h3>Category Breakdown</h3>
            {result.categories.map((category) => (
              <div key={category.id} className="breakdown-row">
                <span>{category.title}</span>
                <strong>{category.score.toFixed(1)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-side-section dashboard-side-section--actions">
          <h3>Actions</h3>
          <div className="actions">
            <a href="/assessment" className="button solid">
              New Assessment
            </a>
          </div>
        </section>
      </aside>

      <article className="card results-content-card">
        <section className="suggestions">
          <h3>Actions to Improve</h3>
          {result.categories.flatMap((category) =>
            category.suggestions.map((suggestion) => (
              <article key={suggestion.id} className="suggestion-item">
                <p className="suggestion-category">{category.title}</p>
                <h4>{suggestion.title}</h4>
                <p>{suggestion.action}</p>
              </article>
            )),
          )}
          {result.categories.every((c) => c.suggestions.length === 0) && (
            <p className="no-suggestions">
              Great job! Keep maintaining these high standards.
            </p>
          )}
        </section>
      </article>
    </div>
  );
}
