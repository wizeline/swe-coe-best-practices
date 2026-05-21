import {
  AnswerMap,
  AssessmentModel,
  AssessmentResult,
  CategoryResult,
  RecommendationBand,
  Recommendation,
  ScoreValue,
} from "@/types/assessment";
import { MAX_RECOMMENDATIONS_PER_PILLAR } from "@/lib/config";

/**
 * Dynamic score band boundaries.
 *
 * Bands are resolved from the maximum possible raw score so the thresholds
 * stay stable as percentages when the questionnaire changes.
 */
export const SCORE_PERCENTILES = {
  disciplinedMin: 0.43,
  optimizedMin: 0.65,
  strategicMin: 0.85,
} as const;

export const SCORE_LEVEL_FLOORS = {
  optimizedMinCategoryScore: 2.5,
  strategicMinCategoryScore: 3,
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((acc, value) => acc + value, 0) / values.length;
};

export const resolveScoreBands = (maxScore: number): Record<RecommendationBand, number> => {
  const safeMaxScore = Math.max(0, Math.floor(maxScore));
  if (safeMaxScore === 0) {
    return {
      foundational: 0,
      disciplined: 0,
      optimized: 0,
      strategic: Infinity,
    };
  }

  const disciplinedMin = Math.min(
    safeMaxScore,
    Math.max(1, Math.ceil(safeMaxScore * SCORE_PERCENTILES.disciplinedMin))
  );
  const optimizedMin = Math.min(
    safeMaxScore,
    Math.max(disciplinedMin, Math.ceil(safeMaxScore * SCORE_PERCENTILES.optimizedMin))
  );
  const strategicMin = Math.min(
    safeMaxScore,
    Math.max(optimizedMin, Math.ceil(safeMaxScore * SCORE_PERCENTILES.strategicMin))
  );

  return {
    foundational: Math.max(0, disciplinedMin - 1),
    disciplined: Math.max(0, optimizedMin - 1),
    optimized: Math.max(0, strategicMin - 1),
    // strategic uses Infinity so top-band recommendations are always eligible.
    strategic: Infinity,
  };
};

const SCORE_LEVELS: AssessmentResult["scoreLevel"][] = [
  "Foundational",
  "Disciplined",
  "Optimized",
  "Strategic",
];

const resolveScoreLevelByTotal = (
  score: number,
  maxScore: number
): AssessmentResult["scoreLevel"] => {
  const bands = resolveScoreBands(maxScore);

  if (score <= bands.foundational) {
    return "Foundational";
  }
  if (score <= bands.disciplined) {
    return "Disciplined";
  }
  if (score <= bands.optimized) {
    return "Optimized";
  }
  return "Strategic";
};

const resolveMaxAllowedLevelByCategoryScores = (
  categoryScores?: number[]
): AssessmentResult["scoreLevel"] => {
  if (!categoryScores || categoryScores.length === 0) {
    return "Strategic";
  }

  const minCategoryScore = Math.min(...categoryScores);

  if (minCategoryScore < SCORE_LEVEL_FLOORS.optimizedMinCategoryScore) {
    return "Disciplined";
  }

  if (minCategoryScore < SCORE_LEVEL_FLOORS.strategicMinCategoryScore) {
    return "Optimized";
  }

  return "Strategic";
};

export const getScoreLevel = (
  score: number,
  maxScore: number,
  categoryScores?: number[]
): AssessmentResult["scoreLevel"] => {
  const levelByTotal = resolveScoreLevelByTotal(score, maxScore);
  const maxAllowedLevel = resolveMaxAllowedLevelByCategoryScores(categoryScores);

  return SCORE_LEVELS[
    Math.min(SCORE_LEVELS.indexOf(levelByTotal), SCORE_LEVELS.indexOf(maxAllowedLevel))
  ];
};

export interface ScoreLevelProgress {
  currentLevel: AssessmentResult["scoreLevel"];
  nextLevel: AssessmentResult["scoreLevel"] | null;
  nextLevelMinScore: number | null;
  pointsToNextLevel: number;
}

export const getScoreLevelProgress = (
  score: number,
  maxScore: number,
  categoryScores?: number[]
): ScoreLevelProgress => {
  const currentLevel = getScoreLevel(score, maxScore, categoryScores);
  const currentIndex = SCORE_LEVELS.indexOf(currentLevel);
  const nextLevel = currentIndex >= SCORE_LEVELS.length - 1 ? null : SCORE_LEVELS[currentIndex + 1];

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      nextLevelMinScore: null,
      pointsToNextLevel: 0,
    };
  }

  const bands = resolveScoreBands(maxScore);
  const nextLevelMinByLevel: Record<AssessmentResult["scoreLevel"], number> = {
    Foundational: 0,
    Disciplined: bands.foundational + 1,
    Optimized: bands.disciplined + 1,
    Strategic: bands.optimized + 1,
  };

  const nextLevelMinScore = nextLevelMinByLevel[nextLevel];
  const pointsToNextLevel = Math.max(0, Number((nextLevelMinScore - score).toFixed(2)));

  return {
    currentLevel,
    nextLevel,
    nextLevelMinScore,
    pointsToNextLevel,
  };
};

const getCategorySuggestions = (
  score: number,
  recommendations: Recommendation[],
  bands: Record<RecommendationBand, number>
): Recommendation[] => {
  // Resolve band → numeric threshold at runtime so the template stays symbolic.
  const resolved = recommendations.map((item) => ({
    ...item,
    maxScoreInclusive: item.band ? bands[item.band] : (item.maxScoreInclusive ?? 0),
  }));

  // Find the most relevant action items (closest maxScoreInclusive >= score).
  // This shows the next achievable goals, not all previous ones.
  const filtered = resolved
    .filter((item) => score <= item.maxScoreInclusive)
    .sort((a, b) => a.maxScoreInclusive - b.maxScoreInclusive);

  return filtered.slice(0, MAX_RECOMMENDATIONS_PER_PILLAR);
};

export const calculateAssessment = (
  model: AssessmentModel,
  answers: AnswerMap
): AssessmentResult => {
  const totalQuestions = model.categories.reduce((acc, current) => acc + current.questions.length, 0);
  const maxScore = totalQuestions * 4;
  const scoreBands = resolveScoreBands(maxScore);

  // Compute totalScore first so suggestion selection uses the correct score band.
  const totalScore = model.categories.reduce((acc, category) => {
    const categoryTotal = category.questions.reduce((categoryAcc, question) => {
      return categoryAcc + (answers[question.id] ?? 0);
    }, 0);
    return acc + categoryTotal;
  }, 0);

  const categoryResults: CategoryResult[] = model.categories.map((category) => {
    const questionScores = category.questions
      .map((question) => answers[question.id])
      .filter((score): score is ScoreValue => score !== undefined);

    const categoryScore = average(questionScores);

    return {
      id: category.id,
      title: category.title,
      score: Number(categoryScore.toFixed(2)),
      answered: questionScores.length,
      total: category.questions.length,
      weight: category.weight,
      suggestions: getCategorySuggestions(
        totalScore,
        [...category.recommendations].sort((a, b) => {
          const aMax = a.band ? scoreBands[a.band] : (a.maxScoreInclusive ?? 0);
          const bMax = b.band ? scoreBands[b.band] : (b.maxScoreInclusive ?? 0);
          return aMax - bMax;
        }),
        scoreBands
      ),
    };
  });

  const totalAnswered = categoryResults.reduce((acc, current) => acc + current.answered, 0);

  const weightedScoreSum = categoryResults.reduce(
    (acc, current) => acc + current.score * current.weight,
    0
  );
  const weightTotal = categoryResults.reduce((acc, current) => acc + current.weight, 0);

  const overall = weightTotal === 0 ? 0 : weightedScoreSum / weightTotal;
  const completion = totalQuestions === 0 ? 0 : (totalAnswered / totalQuestions) * 100;

  return {
    overallScore: Number(clamp(overall, 0, 4).toFixed(2)),
    totalScore,
    maxScore,
    completion: Number(clamp(completion, 0, 100).toFixed(0)),
    scoreLevel: getScoreLevel(
      totalScore,
      maxScore,
      categoryResults.map((category) => category.score)
    ),
    categories: categoryResults,
  };
};
