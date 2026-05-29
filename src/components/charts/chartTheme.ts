import { AssessmentResult } from "@/types/assessment";

export const SCORE_LEVEL_COLORS: Record<AssessmentResult["scoreLevel"], string> = {
  Foundational: "#b91c1c",
  Disciplined: "#b45309",
  Optimized: "#15803d",
  Strategic: "#0f766e",
};

export const CHART_SERIES_COLORS = {
  primary: "var(--brand-primary)",
  secondary: "var(--brand-accent)",
  surfaceStroke: "var(--surface-stroke)",
};