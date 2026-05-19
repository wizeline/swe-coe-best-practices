import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "src/data/assessmentTemplate.ts");
const FRAMEWORK_PATH = path.join(ROOT, "FRAMEWORK.md");

const START_MARKER = "<!-- AUTO-GENERATED:ASSESSMENT_FRAMEWORK:START -->";
const END_MARKER = "<!-- AUTO-GENERATED:ASSESSMENT_FRAMEWORK:END -->";
const SECTION_HEADER = "## Assessment Framework — 5 Pillars";

const BAND_ORDER = ["foundational", "disciplined", "optimized", "strategic"];
const BAND_LABEL = {
  foundational: "Foundational",
  disciplined: "Disciplined",
  optimized: "Optimized",
  strategic: "Strategic",
};

function escapeMd(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n+/g, " ").trim();
}

function extractQuestionNumber(questionId, fallback) {
  const match = questionId.match(/q(\d+)$/i);
  if (!match) {
    return fallback;
  }
  return Number.parseInt(match[1], 10);
}

function loadAssessmentTemplate() {
  const source = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const normalized = source
    .replace(/^import[^\n]*\n/gm, "")
    .replace(
      /export\s+const\s+assessmentTemplate\s*:\s*AssessmentModel\s*=\s*/,
      "const assessmentTemplate = "
    );

  const assessmentTemplate = new Function(`${normalized}\nreturn assessmentTemplate;`)();

  if (!assessmentTemplate || !Array.isArray(assessmentTemplate.categories)) {
    throw new Error("Could not parse assessmentTemplate.ts");
  }

  return assessmentTemplate;
}

function renderGeneratedSection(model) {
  const totalQuestions = model.categories.reduce(
    (acc, category) => acc + category.questions.length,
    0
  );
  const pillarCount = model.categories.length;

  const lines = [
    SECTION_HEADER,
    "",
    `The assessment covers **${totalQuestions} questions across ${pillarCount} pillars**, each weighted equally at 20% of the total score.`,
    "",
    "> **Self-assessment instruction:** Select the option that most accurately describes what **you personally do today**, not what your team or project does in general.",
    "",
    "---",
    "",
  ];

  model.categories.forEach((category) => {
    lines.push(`### ${escapeMd(category.title)}`);
    lines.push("");
    lines.push(`*${escapeMd(category.description)}*`);
    lines.push("");
    lines.push("#### Questions");
    lines.push("");

    category.questions.forEach((question, index) => {
      const qNumber = extractQuestionNumber(question.id, index + 1);
      lines.push(`**Q${qNumber} · ${escapeMd(question.text)}**`);
      lines.push("");
      lines.push("| Score | Description |");
      lines.push("|---|---|");
      lines.push(`| 1 – Foundational | ${escapeMd(question.hint?.[1] ?? "")} |`);
      lines.push(`| 2 – Disciplined | ${escapeMd(question.hint?.[2] ?? "")} |`);
      lines.push(`| 3 – Optimized | ${escapeMd(question.hint?.[3] ?? "")} |`);
      lines.push(`| 4 – Strategic | ${escapeMd(question.hint?.[4] ?? "")} |`);
      lines.push("");
      lines.push("---");
      lines.push("");
    });

    lines.push("#### Recommendations");
    lines.push("");
    lines.push("| Band | Action |");
    lines.push("|---|---|");

    const orderedRecommendations = [...category.recommendations].sort((left, right) => {
      const leftIndex = BAND_ORDER.indexOf(left.band ?? "strategic");
      const rightIndex = BAND_ORDER.indexOf(right.band ?? "strategic");
      return leftIndex - rightIndex;
    });

    orderedRecommendations.forEach((recommendation) => {
      const band = recommendation.band ?? "strategic";
      const bandLabel = BAND_LABEL[band] ?? "Strategic";
      const action = `**${escapeMd(recommendation.title)}.** ${escapeMd(recommendation.action)}`;
      lines.push(`| **${bandLabel}** | ${action} |`);
    });

    lines.push("");
    lines.push("---");
    lines.push("");
  });

  return lines.join("\n").trimEnd() + "\n";
}

function replaceFrameworkSection(generatedSection) {
  const framework = fs.readFileSync(FRAMEWORK_PATH, "utf8");

  if (framework.includes(START_MARKER) && framework.includes(END_MARKER)) {
    const markerRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`, "m");
    return framework.replace(markerRegex, `${START_MARKER}\n${generatedSection}${END_MARKER}`);
  }

  const sectionIndex = framework.indexOf(SECTION_HEADER);
  if (sectionIndex === -1) {
    throw new Error(`Could not find section header: ${SECTION_HEADER}`);
  }

  const staticPrefix = framework.slice(0, sectionIndex).trimEnd();
  return `${staticPrefix}\n\n${START_MARKER}\n${generatedSection}${END_MARKER}\n`;
}

function main() {
  const model = loadAssessmentTemplate();
  const generatedSection = renderGeneratedSection(model);
  const nextFramework = replaceFrameworkSection(generatedSection);
  fs.writeFileSync(FRAMEWORK_PATH, nextFramework);
  process.stdout.write("FRAMEWORK.md synchronized from assessmentTemplate.ts\n");
}

main();