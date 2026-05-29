"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AssessmentResult } from "@/types/assessment";
import { CHART_SERIES_COLORS, SCORE_LEVEL_COLORS } from "@/components/charts/chartTheme";

interface ScoreLevelDistributionProps {
  sessions: Array<{ scoreLevel: AssessmentResult["scoreLevel"] }>;
}

const SCORE_LEVEL_ORDER: AssessmentResult["scoreLevel"][] = [
  "Foundational",
  "Disciplined",
  "Optimized",
  "Strategic",
];

export function ScoreLevelDistribution({ sessions }: ScoreLevelDistributionProps) {
  const data = SCORE_LEVEL_ORDER.map((scoreLevel) => ({
    scoreLevel,
    total: sessions.filter((session) => session.scoreLevel === scoreLevel).length,
    color: SCORE_LEVEL_COLORS[scoreLevel],
  }));
  const hasData = data.some((entry) => entry.total > 0);

  return (
    <article className="card results-content-card chart-card" data-testid="score-level-distribution">
      <div className="chart-card-header">
        <div>
          <h3>Score Level Distribution</h3>
          <p>How many filtered teams fall into each score level.</p>
        </div>
      </div>
      {!hasData ? (
        <p className="chart-empty-state">No teams match the current filter.</p>
      ) : (
        <>
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={CHART_SERIES_COLORS.surfaceStroke} strokeDasharray="3 3" />
                <XAxis dataKey="scoreLevel" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(227, 44, 39, 0.06)" }} />
                <Bar dataKey="total" radius={[10, 10, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={entry.scoreLevel} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-metric-list" aria-label="score level distribution summary">
            {data.map((entry) => (
              <div key={entry.scoreLevel} className="chart-metric-item">
                <span className="chart-metric-label">
                  <span className="chart-swatch" style={{ background: entry.color }} />
                  {entry.scoreLevel}
                </span>
                <strong>{entry.total}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}