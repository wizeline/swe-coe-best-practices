"use client";

import { useState } from "react";
import { ErrorToast } from "@/components/assessment/ErrorToast";

interface RepositoryAnalysisSubmissionProps {
  promptContent: string;
}

export function RepositoryAnalysisSubmission({
  promptContent,
}: RepositoryAnalysisSubmissionProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [localScore, setLocalScore] = useState<{ rawScore: number; scoreLevel: string } | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [copyError, setCopyError] = useState("");
  const [toastError, setToastError] = useState("");

  const handleCopyPrompt = async () => {
    setCopyMessage("");
    setCopyError("");

    if (!navigator.clipboard?.writeText) {
      setCopyError("Clipboard is unavailable. Select the prompt manually and copy it.");
      return;
    }

    try {
      await navigator.clipboard.writeText(promptContent);
      setCopyMessage("Prompt copied to clipboard.");
    } catch {
      setCopyError("Prompt could not be copied. Select it manually and try again.");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLocalScore(null);
    setToastError("");

    if (!jsonInput.trim()) {
      setError("Please paste the analysis JSON output.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsed = JSON.parse(jsonInput) as {
        analysis?: { raw_score?: number; score_level?: string };
      };
      const rawScore = parsed?.analysis?.raw_score;
      const scoreLevel = parsed?.analysis?.score_level;
      if (typeof rawScore !== "number" || typeof scoreLevel !== "string") {
        setError("Invalid JSON format. Make sure it includes analysis.raw_score and analysis.score_level.");
        return;
      }
      setLocalScore({ rawScore, scoreLevel });
      setJsonInput("");
    } catch {
      setError("Invalid JSON. Please paste the exact output from the analysis prompt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setJsonInput("");
    setError("");
    setLocalScore(null);
  };

  return (
    <article className="card form-card">
      <ErrorToast message={toastError} onClose={() => setToastError("")} />
      <header className="card-header">
        <div className="form-header-row">
          <h2>Repository Analysis</h2>
        </div>
        <p>Use the AI prompt to score a repository, then paste the JSON result here to view it locally.</p>
      </header>

      <div className="form-content">
        <section className="analysis-section">
          <h3>Repository Analysis Prompt</h3>
          <p className="section-description">
            Open the prompt, copy it, and paste it into your AI assistant before returning here with
            the JSON output.
          </p>

          <details className="json-format-helper prompt-helper">
            <summary>Open Prompt</summary>
            <div className="prompt-helper-actions">
              <button
                type="button"
                className="button ghost"
                onClick={() => void handleCopyPrompt()}
              >
                Copy Prompt
              </button>
            </div>
            <textarea
              value={promptContent}
              readOnly
              className="json-textarea prompt-textarea"
              aria-label="Repository analysis prompt"
              rows={18}
            />
          </details>

          {copyError && (
            <p className="form-error" role="alert" aria-live="assertive">
              {copyError}
            </p>
          )}
          {copyMessage && (
            <p className="form-success" role="status" aria-live="polite">
              {copyMessage}
            </p>
          )}
        </section>

        <section className="analysis-section">
          <h3>Paste Analysis JSON</h3>
          <p className="section-description">
            Run the repository analysis prompt in your AI assistant of choice, then paste only the
            JSON output here.
          </p>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`Paste only the JSON output from the analysis prompt here...`}
            className="json-textarea"
            disabled={isSubmitting}
            rows={12}
          />

          <details className="json-format-helper">
            <summary>Expected JSON Format</summary>
            <pre>{`{
  "analysis": {
    "pillars": {
      "pillar-1-ideation": {
        "title": "Pillar 1 – Ideation & Requirements",
        "questions": [
          { "id": "p1-q1", "score": 2 },
          { "id": "p1-q2", "score": 2 },
          { "id": "p1-q3", "score": 2 }
        ],
        "pillar_score": 2
      },
      "pillar-2-design": {
        "title": "Pillar 2 – Design & Architecture",
        "questions": [
          { "id": "p2-q1", "score": 2 },
          { "id": "p2-q2", "score": 2 },
          { "id": "p2-q3", "score": 2 }
        ],
        "pillar_score": 2
      },
      "pillar-3-development": {
        "title": "Pillar 3 – Development Hygiene",
        "questions": [
          { "id": "p3-q1", "score": 2 },
          { "id": "p3-q2", "score": 2 },
          { "id": "p3-q3", "score": 2 }
        ],
        "pillar_score": 2
      },
      "pillar-4-quality": {
        "title": "Pillar 4 – Quality Engineering",
        "questions": [
          { "id": "p4-q1", "score": 2 },
          { "id": "p4-q2", "score": 2 },
          { "id": "p4-q3", "score": 2 }
        ],
        "pillar_score": 2
      },
      "pillar-5-operations": {
        "title": "Pillar 5 – Operations & Maintenance",
        "questions": [
          { "id": "p5-q1", "score": 2 },
          { "id": "p5-q2", "score": 2 },
          { "id": "p5-q3", "score": 2 }
        ],
        "pillar_score": 2
      }
    },
    "raw_score": 30,
    "score_level": "Disciplined"
  }
}`}</pre>
          </details>
        </section>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleReset}
            className="button ghost"
            disabled={isSubmitting}
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="button solid"
            disabled={isSubmitting || !jsonInput.trim()}
          >
            {isSubmitting ? "Submitting…" : "Submit Analysis"}
          </button>
        </div>

        {error && (
          <p className="form-error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
        {localScore && (
          <div className="form-success" role="status" aria-live="polite">
            <strong>Score: {localScore.rawScore}</strong> — Level:{" "}
            <strong>{localScore.scoreLevel}</strong>
          </div>
        )}
      </div>
    </article>
  );
}
