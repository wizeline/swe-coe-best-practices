"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AssessmentResult } from "@/types/assessment";
import { CHART_SERIES_COLORS, SCORE_LEVEL_COLORS } from "@/components/charts/chartTheme";

interface TeamRankingChartProps {
  teams: Array<{
    name: string;
    averageTotalScore: number;
    maxScore: number;
    scoreLevel: AssessmentResult["scoreLevel"];
  }>;
}

export function TeamRankingChart({ teams }: TeamRankingChartProps) {
  const sortedTeams = [...teams].sort(
    (left, right) =>
      right.averageTotalScore - left.averageTotalScore || left.name.localeCompare(right.name)
  );
  const hasData = sortedTeams.length > 0;
  const maxScore = Math.max(...sortedTeams.map((team) => team.maxScore), 4);

  return (
    <article className="card results-content-card chart-card chart-card--wide" data-testid="team-ranking-chart">
      <div className="chart-card-header">
        <div>
          <h3>Team Ranking</h3>
          <p>Filtered teams sorted by average score and colored by score level.</p>
        </div>
      </div>
      {!hasData ? (
        <p className="chart-empty-state">No filtered teams are available for ranking.</p>
      ) : (
        <>
          <div className="chart-frame chart-frame--ranking">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedTeams} layout="vertical" margin={{ top: 12, right: 16, bottom: 0, left: 48 }}>
                <CartesianGrid stroke={CHART_SERIES_COLORS.surfaceStroke} strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, maxScore]} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={140} />
                <Tooltip formatter={(value, _name, item) => `${Number(value).toFixed(1)} / ${item.payload.maxScore}`} />
                <Bar dataKey="averageTotalScore" radius={[0, 10, 10, 0]}>
                  {sortedTeams.map((team) => (
                    <Cell key={team.name} fill={SCORE_LEVEL_COLORS[team.scoreLevel]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-metric-list" aria-label="team ranking summary">
            {sortedTeams.map((team) => (
              <div key={team.name} className="chart-metric-item">
                <span className="chart-metric-label">
                  <span
                    className="chart-swatch"
                    style={{ background: SCORE_LEVEL_COLORS[team.scoreLevel] }}
                  />
                  {team.name}
                </span>
                <strong>
                  {team.averageTotalScore.toFixed(1)} / {team.maxScore}
                </strong>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}