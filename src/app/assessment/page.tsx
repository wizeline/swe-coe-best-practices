import { readFile } from "fs/promises";
import path from "path";
import { AssessmentForm } from "@/components/assessment/AssessmentForm";
import { RepositoryAnalysisSubmission } from "@/components/assessment/RepositoryAnalysisSubmission";

export default async function AssessmentPage() {
  const promptContent = await readFile(
    path.join(process.cwd(), "prompts", "repo-analysis.md"),
    "utf8"
  );

  return (
    <section className="page-container">
      <div className="page-header">
        <h1>Assessment Form</h1>
        <p>Fill out this form to evaluate your engineering team&apos;s Best Practices Framework.</p>
      </div>
      <AssessmentForm />

      <div className="divider-section">
        <h2 className="divider-title">Or Submit a Repository Analysis</h2>
        <p className="divider-description">
          Use our AI analysis prompt to automatically score your repository based on observable
          signals.
        </p>
      </div>

      <RepositoryAnalysisSubmission promptContent={promptContent} />
    </section>
  );
}
