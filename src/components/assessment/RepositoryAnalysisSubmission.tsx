"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assessmentTemplate } from "@/data/assessmentTemplate";
import { clearDraft, saveResult } from "@/lib/draftStorage";
import { calculateAssessment } from "@/lib/scoring";
import { ErrorToast } from "@/components/assessment/ErrorToast";
import { AnswerMap, AssessmentResult, ScoreValue } from "@/types/assessment";

interface RepositoryAnalysisSubmissionProps {
  promptContent: string;
}

function extractAnswersFromJson(parsed: unknown): AnswerMap {
  const answers: AnswerMap = {};
  if (!parsed || typeof parsed !== "object") return answers;

  const record = parsed as Record<string, unknown>;
  const analysis = (record.analysis && typeof record.analysis === "object"
    ? record.analysis
    : record) as Record<string, unknown>;

  const pillars = analysis.pillars;
  if (pillars && typeof pillars === "object") {
    for (const pillarObj of Object.values(pillars as Record<string, unknown>)) {
      if (pillarObj && typeof pillarObj === "object") {
        const questions = (pillarObj as Record<string, unknown>).questions;
        if (Array.isArray(questions)) {
          for (const q of questions) {
            if (q && typeof q === "object") {
              const qObj = q as Record<string, unknown>;
              const id = qObj.id;
              const score = qObj.score;
              if (typeof id === "string" && typeof score === "number") {
                if (score >= 1 && score <= 4) {
                  answers[id] = score as ScoreValue;
                }
              }
            }
          }
        }
      }
    }
  }

  return answers;
}

export function RepositoryAnalysisSubmission({
  promptContent,
}: RepositoryAnalysisSubmissionProps) {
  const router = useRouter();
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
      const parsed = JSON.parse(jsonInput) as Record<string, unknown>;
      const analysis = (parsed?.analysis && typeof parsed.analysis === "object"
        ? parsed.analysis
        : parsed) as Record<string, unknown>;

      const rawScore = typeof analysis?.raw_score === "number" ? analysis.raw_score : undefined;
      const scoreLevel =
        typeof analysis?.score_level === "string" ? analysis.score_level : undefined;

      const answers = extractAnswersFromJson(parsed);
      const hasAnswers = Object.keys(answers).length > 0;

      if (!hasAnswers && (rawScore === undefined || scoreLevel === undefined)) {
        setError(
          "Invalid JSON format. Make sure it includes analysis.raw_score and analysis.score_level or analysis.pillars with questions."
        );
        return;
      }

      let result: AssessmentResult;
      if (hasAnswers) {
        result = calculateAssessment(assessmentTemplate, answers);
      } else {
        const totalQuestions = assessmentTemplate.categories.reduce(
          (acc, current) => acc + current.questions.length,
          0
        );
        const maxScore = totalQuestions * 4;
        const totalScore = rawScore ?? 0;
        const level = (scoreLevel as AssessmentResult["scoreLevel"]) ?? "Foundational";

        result = {
          overallScore: Number((totalScore / Math.max(1, totalQuestions)).toFixed(2)),
          totalScore,
          maxScore,
          completion: 100,
          scoreLevel: level,
          categories: assessmentTemplate.categories.map((category) => ({
            id: category.id,
            title: category.title,
            score: Number((totalScore / Math.max(1, totalQuestions)).toFixed(2)),
            answered: category.questions.length,
            total: category.questions.length,
            weight: category.weight,
            suggestions: [],
          })),
        };
      }

      saveResult(result, answers);
      await clearDraft();

      setLocalScore({ rawScore: result.totalScore, scoreLevel: result.scoreLevel });
      setJsonInput("");

      router.push("/dashboard");
    } catch (err) {
      console.error("Analysis submission error:", err);
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
